import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JansLockConfiguration from 'Plugins/jans-lock/components/JansLockConfiguration'
import type { JansLockFormClasses, LockConfig } from 'Plugins/jans-lock/types'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Lock: 'Lock', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Lock: [], Webhooks: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Lock: 'Lock', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Lock: [], Webhooks: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetWebhooksByFeatureId: jest.fn(() => ({ data: [], isFetching: false, isFetched: true })),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    webhookReducer: (
      state = {
        featureWebhooks: [],
        loadingWebhooks: false,
        webhookModal: false,
        triggerWebhookInProgress: false,
      },
    ) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

const classes = new Proxy({} as JansLockFormClasses, {
  get: (_target, key) => String(key),
})

const lockConfig: LockConfig = {
  baseEndpoint: 'https://lock.example.org/jans-lock/api/v1',
  openIdIssuer: 'https://lock.example.org',
  protectionMode: 'oauth',
  auditPersistenceMode: 'internal',
  clientId: '2200.abc',
  clientPassword: 'encrypted==',
  loggingLevel: 'INFO',
  cleanServiceInterval: 60,
  cleanServiceBatchChunkSize: 10000,
  metricReporterInterval: 300,
  metricReporterKeepDataDays: 15,
  statTimerIntervalInSeconds: 0,
  cedarlingConfiguration: {
    enabled: true,
    logType: 'STD_OUT',
    logLevel: 'INFO',
    maxEntries: 0,
    policySources: [
      { enabled: false, policyStoreUri: 'https://a.example.org/store', authorizationToken: '' },
    ],
  },
  grpcConfiguration: { serverMode: 'bridge', grpcPort: 50051, useTls: false },
  traceConfiguration: {
    enabled: true,
    clientDomainBindings: [
      { clientId: '2200.abc', evidenceDomainId: 'default', allowedProducerIds: ['*'] },
    ],
    latenessThresholdSeconds: 300,
    maxRequestBytes: 262144,
    maxJsonDepth: 32,
    maxStringLength: 8192,
    maxArrayLength: 256,
    maxObjectMembers: 256,
    receiptAllocationRetryLimit: 8,
    receiptRepairIntervalSeconds: 300,
    pendingReceiptTimeoutSeconds: 120,
    maxBulkRecords: 100,
    maxBulkRequestBytes: 4194304,
  },
}

const onUpdate = jest.fn()

const renderForm = (props: { lockConfig?: LockConfig; canWriteLock?: boolean } = {}) =>
  render(
    <Wrapper>
      <JansLockConfiguration
        lockConfig={props.lockConfig ?? lockConfig}
        onUpdate={onUpdate}
        canWriteLock={props.canWriteLock ?? true}
        classes={classes}
      />
    </Wrapper>,
  )

const field = (name: string) => document.querySelector(`[name="${name}"]`) as HTMLInputElement
const applyButton = () => document.querySelector('button[type="submit"]') as HTMLButtonElement
const section = (title: RegExp) => screen.getByRole('region', { name: title })

describe('JansLockConfiguration', () => {
  beforeEach(() => onUpdate.mockClear())

  it('renders every section the server returned', () => {
    renderForm()
    ;[/general/i, /protection/i, /cedarling/i, /grpc/i, /trace/i, /logging/i, /metrics/i, /clean/i]
      .map(section)
      .forEach((region) => expect(region).toBeInTheDocument())
  })

  it('shows each section as an open accordion with its title', () => {
    renderForm()
    const trace = section(/trace/i)
    expect(trace.querySelector('.card.b-primary')).toBeInTheDocument()
    expect(within(trace).getByText(/trace/i, { selector: '.card-header' })).toBeVisible()
    expect(field('traceConfiguration.maxJsonDepth')).toBeVisible()
  })

  it('hides sections the server did not return', () => {
    renderForm({ lockConfig: { ...lockConfig, traceConfiguration: undefined } })
    expect(screen.queryByRole('region', { name: /trace/i })).toBeNull()
    expect(field('traceConfiguration.maxJsonDepth')).toBeNull()
  })

  it('does not render removed legacy fields', () => {
    renderForm()
    ;['metricChannel', 'pdpType', 'policiesJsonUris', 'policiesZipUris'].forEach((name) =>
      expect(field(name)).toBeNull(),
    )
  })

  it('shows loaded values, including list rows', () => {
    renderForm()
    expect(field('grpcConfiguration.grpcPort')).toHaveValue(50051)
    expect(field('cedarlingConfiguration.policySources.0.policyStoreUri')).toHaveValue(
      'https://a.example.org/store',
    )
    expect(field('cedarlingConfiguration.policySources.0.enabled')).not.toBeChecked()
    expect(field('traceConfiguration.clientDomainBindings.0.allowedProducerIds')).toHaveValue('*')
  })

  it('keeps the client password and base DN read-only', () => {
    renderForm()
    expect(field('clientPassword')).toBeDisabled()
    expect(field('clientPassword')).toHaveAttribute('type', 'password')
    expect(field('baseDN')).toBeDisabled()
  })

  it('keeps apply disabled until something changes', async () => {
    renderForm()
    await waitFor(() => expect(applyButton()).toBeDisabled())
    fireEvent.change(field('grpcConfiguration.grpcPort'), { target: { value: '50052' } })
    await waitFor(() => expect(applyButton()).toBeEnabled())
  })

  it('keeps apply disabled while a value is invalid', async () => {
    renderForm()
    fireEvent.change(field('grpcConfiguration.grpcPort'), { target: { value: '70000' } })
    await waitFor(() => expect(applyButton()).toBeDisabled())
  })

  it('accepts an empty disabled policy source until it is enabled', async () => {
    renderForm({
      lockConfig: {
        ...lockConfig,
        cedarlingConfiguration: {
          ...lockConfig.cedarlingConfiguration,
          policySources: [{ enabled: false, policyStoreUri: '', authorizationToken: '' }],
        },
      },
    })
    fireEvent.change(field('grpcConfiguration.grpcPort'), { target: { value: '50052' } })
    await waitFor(() => expect(applyButton()).toBeEnabled())
    fireEvent.click(field('cedarlingConfiguration.policySources.0.enabled'))
    await waitFor(() => expect(applyButton()).toBeDisabled())
  })

  it('marks required fields and explains an invalid evidence domain id', async () => {
    renderForm()
    expect(within(section(/general/i)).getAllByText('*')).toHaveLength(3)
    fireEvent.change(field('traceConfiguration.clientDomainBindings.0.evidenceDomainId'), {
      target: { value: 'my domain' },
    })
    expect(await screen.findByText(/1–64 letters, digits/)).toBeInTheDocument()
    await waitFor(() => expect(applyButton()).toBeDisabled())
  })

  it('adds and removes policy source rows', async () => {
    renderForm()
    const cedarling = section(/cedarling/i)
    fireEvent.click(within(cedarling).getByRole('button', { name: /add policy source/i }))
    await waitFor(() =>
      expect(field('cedarlingConfiguration.policySources.1.policyStoreUri')).toBeInTheDocument(),
    )
    expect(field('cedarlingConfiguration.policySources.1.enabled')).toBeChecked()

    fireEvent.click(within(cedarling).getAllByRole('button', { name: /remove/i })[0])
    await waitFor(() =>
      expect(field('cedarlingConfiguration.policySources.1.policyStoreUri')).toBeNull(),
    )
  })

  it('hides list and form controls in read-only mode', () => {
    renderForm({ canWriteLock: false })
    expect(screen.queryByRole('button', { name: /add policy source/i })).toBeNull()
    expect(screen.queryByRole('button', { name: /add client binding/i })).toBeNull()
    expect(field('grpcConfiguration.grpcPort')).toBeDisabled()
    expect(applyButton()).toBeNull()
  })

  it('sends only the changed paths after the commit dialog', async () => {
    renderForm()
    fireEvent.change(field('grpcConfiguration.grpcPort'), { target: { value: '50052' } })
    fireEvent.click(field('cedarlingConfiguration.policySources.0.enabled'))
    await waitFor(() => expect(applyButton()).toBeEnabled())

    fireEvent.click(applyButton())
    await waitFor(() => expect(document.querySelector('textarea')).toBeInTheDocument())
    const message = document.querySelector('textarea') as HTMLTextAreaElement
    fireEvent.change(message, { target: { value: 'Update Lock gRPC port and policy source' } })
    fireEvent.click(screen.getByRole('button', { name: /^yes$/i }))

    await waitFor(() => expect(onUpdate).toHaveBeenCalledTimes(1))
    expect(onUpdate).toHaveBeenCalledWith([
      {
        op: 'replace',
        path: '/grpcConfiguration/grpcPort',
        value: 50052,
      },
      {
        op: 'replace',
        path: '/cedarlingConfiguration/policySources',
        value: [
          { enabled: true, policyStoreUri: 'https://a.example.org/store', authorizationToken: '' },
        ],
      },
    ])
  })
})
