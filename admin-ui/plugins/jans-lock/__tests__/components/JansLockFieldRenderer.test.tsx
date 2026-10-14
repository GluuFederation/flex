import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useFormik } from 'formik'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JansLockFieldRenderer from 'Plugins/jans-lock/components/JansLockFieldRenderer'
import { transformToFormValues } from 'Plugins/jans-lock/helper/utils'
import type { FieldConfig, JansLockConfigFormValues } from 'Plugins/jans-lock/types'
import type { FormikErrors } from 'formik'

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    noReducer: (state = {}) => state,
  }),
})

const values = transformToFormValues({
  loggingLevel: 'INFO',
  clientPassword: 'encrypted==',
  cleanServiceInterval: 60,
  grpcConfiguration: { grpcPort: 50051, serverMode: 'bridge', useTls: true },
  cedarlingConfiguration: {
    policySources: [{ enabled: true, policyStoreUri: 'https://store.example.org' }],
  },
})

type HarnessProps = {
  config: FieldConfig
  viewOnly?: boolean
  errors?: FormikErrors<JansLockConfigFormValues>
}

const Harness = ({ config, viewOnly = false, errors }: HarnessProps) => {
  const formik = useFormik<JansLockConfigFormValues>({
    initialValues: values,
    initialErrors: errors,
    onSubmit: jest.fn(),
  })
  return (
    <JansLockFieldRenderer
      config={config}
      formik={formik}
      fieldItemClass="field-item"
      fieldItemFullWidthClass="field-item-full"
      viewOnly={viewOnly}
    />
  )
}

const renderField = (props: HarnessProps) =>
  render(
    <AppTestWrapper>
      <Provider store={store}>
        <Harness {...props} />
      </Provider>
    </AppTestWrapper>,
  )

const input = (name: string) => document.querySelector(`[name="${name}"]`) as HTMLInputElement

describe('JansLockFieldRenderer', () => {
  it('reads a nested value by its path', () => {
    renderField({
      config: {
        name: 'grpcConfiguration.grpcPort',
        label: 'fields.lock_grpc_port',
        type: 'number',
      },
    })
    expect(input('grpcConfiguration.grpcPort')).toHaveValue(50051)
  })

  it('reads a value inside a list row', () => {
    renderField({
      config: {
        name: 'cedarlingConfiguration.policySources.0.policyStoreUri',
        label: 'fields.lock_policy_store_uri',
        type: 'text',
      },
    })
    expect(input('cedarlingConfiguration.policySources.0.policyStoreUri')).toHaveValue(
      'https://store.example.org',
    )
  })

  it('renders select options', () => {
    renderField({
      config: {
        name: 'grpcConfiguration.serverMode',
        label: 'fields.lock_grpc_server_mode',
        type: 'select',
        selectOptions: ['disabled', 'bridge'],
      },
    })
    const select = document.querySelector(
      'select[name="grpcConfiguration.serverMode"]',
    ) as HTMLSelectElement
    expect(select).toHaveValue('bridge')
    expect(Array.from(select.options).map(({ value }) => value)).toEqual(
      expect.arrayContaining(['disabled', 'bridge']),
    )
  })

  it('renders a toggle with the nested value', () => {
    renderField({
      config: {
        name: 'grpcConfiguration.useTls',
        label: 'fields.lock_grpc_use_tls',
        type: 'toggle',
      },
    })
    expect(input('grpcConfiguration.useTls')).toBeChecked()
  })

  it('renders a read-only password that can still be revealed', () => {
    renderField({
      config: {
        name: 'clientPassword',
        label: 'fields.client_password',
        type: 'password',
        readOnly: true,
      },
    })
    const password = input('clientPassword')
    expect(password).toHaveAttribute('type', 'password')
    expect(password).toBeDisabled()
    expect(password).toHaveValue('encrypted==')
    expect(screen.getByRole('button', { name: /password\.show|show/i })).toBeEnabled()
  })

  it('disables inputs in view-only mode', () => {
    renderField({
      config: { name: 'loggingLevel', label: 'fields.logging_level', type: 'text' },
      viewOnly: true,
    })
    expect(input('loggingLevel')).toBeDisabled()
  })

  it('shows a nested validation error', () => {
    renderField({
      config: {
        name: 'grpcConfiguration.grpcPort',
        label: 'fields.lock_grpc_port',
        type: 'number',
      },
      errors: { grpcConfiguration: { grpcPort: 'Must be at most 65535' } },
    })
    expect(screen.getByText('Must be at most 65535')).toBeInTheDocument()
  })

  it('uses the full-width class only for 12-column fields', () => {
    const { container, unmount } = renderField({
      config: { name: 'loggingLevel', label: 'fields.logging_level', type: 'text', colSize: 12 },
    })
    expect(container.querySelector('.field-item-full')).toBeInTheDocument()
    unmount()

    const half = renderField({
      config: { name: 'loggingLevel', label: 'fields.logging_level', type: 'text', colSize: 6 },
    })
    expect(half.container.querySelector('.field-item')).toBeInTheDocument()
  })

  it('renders nothing for an unknown type', () => {
    const { container } = renderField({
      config: {
        name: 'loggingLevel',
        label: 'fields.logging_level',
        type: 'unknown' as FieldConfig['type'],
      },
    })
    expect(container.querySelector('[name="loggingLevel"]')).toBeNull()
  })
})
