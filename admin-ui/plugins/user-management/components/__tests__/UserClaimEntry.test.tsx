import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import type { FormikProps } from 'formik'
import UserClaimEntry from '../UserClaimEntry'
import { COUNTRY_ATTR, BIRTHDATE_ATTR } from '../../common'
import { JANS_ADMIN_UI_ROLE_ATTR } from '@/constants'
import type { PersonAttribute } from '../../types'
import type { UserFormValues } from '../../types/CommonTypes'

// The child rows have their own suites; stub each to a marker that echoes the
// props this component computes (branch selection, value coercion, options).
const mockRolesResult = {
  data: [{ role: 'api-admin' }, { role: 'api-viewer' }, { role: undefined }],
  isLoading: false,
  isError: false,
}
jest.mock('JansConfigApi', () => ({
  useGetAllAdminuiRoles: jest.fn(() => mockRolesResult),
}))

jest.mock('@/context/theme/themeContext', () => ({
  useTheme: () => ({ state: { theme: 'light' } }),
}))
jest.mock('@/context/theme/config', () => ({ __esModule: true, default: () => ({}) }))
jest.mock('../UserClaimEntry.style', () => ({
  useStyles: () => ({
    classes: { claimRow: 'claimRow', claimCard: 'claimCard', removeButton: 'removeButton' },
  }),
}))

type FieldValue = string | number | boolean | Array<string | number>
type AutocompleteProps = {
  name: string
  options: string[]
  value: string[]
  disabled?: boolean
  allowCustom?: boolean
  onChange: (next: string[]) => void
}
type SelectRowProps = {
  name: string
  value: FieldValue
  values?: Array<{ key: string; value: string }>
}
type InputRowProps = {
  name: string
  type: string
  value: FieldValue
  isBoolean?: boolean
  handler: () => void
}

jest.mock('Routes/Apps/Gluu/GluuAutocomplete', () => ({
  __esModule: true,
  default: ({ name, options, value, disabled, allowCustom, onChange }: AutocompleteProps) => (
    <div
      data-testid="autocomplete"
      data-name={name}
      data-disabled={String(!!disabled)}
      data-allowcustom={String(!!allowCustom)}
    >
      <span data-testid="ac-options">{JSON.stringify(options)}</span>
      <span data-testid="ac-value">{JSON.stringify(value)}</span>
      <button type="button" onClick={() => onChange(['x'])}>
        change-ac
      </button>
    </div>
  ),
}))
jest.mock('Routes/Apps/Gluu/GluuRemovableSelectRow', () => ({
  __esModule: true,
  default: ({ name, value, values }: SelectRowProps) => (
    <div
      data-testid="select-row"
      data-name={name}
      data-value={String(value)}
      data-count={values?.length}
    />
  ),
}))
jest.mock('Routes/Apps/Gluu/GluuRemovableInputRow', () => ({
  __esModule: true,
  default: ({ name, type, value, isBoolean, handler }: InputRowProps) => (
    <div
      data-testid="input-row"
      data-name={name}
      data-type={type}
      data-value={String(value)}
      data-boolean={String(!!isBoolean)}
    >
      <button type="button" onClick={handler}>
        remove
      </button>
    </div>
  ),
}))
jest.mock('@/components/icons', () => ({ Close: () => <span>x</span> }))
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

// The builder loosens dataType to a plain string so tests can pass raw casing
// like 'DATE' (the component lowercases it at runtime); the result is cast back.
const attr = (
  over: Partial<Omit<PersonAttribute, 'dataType'>> & { dataType?: string },
): PersonAttribute =>
  ({ name: 'department', displayName: 'Department', ...over }) as PersonAttribute

const formikWith = (values: Record<string, FieldValue>) => {
  const setFieldValue = jest.fn()
  const setFieldTouched = jest.fn()
  const formik = {
    values,
    setFieldValue,
    setFieldTouched,
  } as object as FormikProps<UserFormValues>
  return { formik, setFieldValue, setFieldTouched }
}

const renderEntry = (data: PersonAttribute, values: Record<string, FieldValue> = {}) => {
  const { formik, setFieldValue, setFieldTouched } = formikWith(values)
  const handler = jest.fn()
  render(<UserClaimEntry data={data} entry={data.name} formik={formik} handler={handler} />)
  return { handler, setFieldValue, setFieldTouched }
}

describe('UserClaimEntry', () => {
  describe('multi-valued attribute branch', () => {
    it('renders an autocomplete listing the current string values', () => {
      renderEntry(attr({ oxMultiValuedAttribute: true }), { department: ['a', 'b', 3] })
      expect(screen.getByTestId('autocomplete')).toBeInTheDocument()
      // Non-string entries are filtered out of the value list.
      expect(screen.getByTestId('ac-value')).toHaveTextContent(JSON.stringify(['a', 'b']))
    })

    it('uses fetched roles as options and blocks custom entries for the role attribute', () => {
      renderEntry(attr({ name: JANS_ADMIN_UI_ROLE_ATTR, oxMultiValuedAttribute: true }), {})
      // undefined role is dropped, only truthy roles remain.
      expect(screen.getByTestId('ac-options')).toHaveTextContent(
        JSON.stringify(['api-admin', 'api-viewer']),
      )
      expect(screen.getByTestId('autocomplete')).toHaveAttribute('data-allowcustom', 'false')
    })

    it('pushes selection changes and marks the field touched', () => {
      const { setFieldValue, setFieldTouched } = renderEntry(
        attr({ oxMultiValuedAttribute: true }),
        {},
      )
      fireEvent.click(screen.getByText('change-ac'))
      expect(setFieldValue).toHaveBeenCalledWith('department', ['x'])
      expect(setFieldTouched).toHaveBeenCalledWith('department', true, false)
    })

    it('removes the claim via the remove button', () => {
      const { handler } = renderEntry(attr({ oxMultiValuedAttribute: true }), {})
      fireEvent.click(screen.getByLabelText('actions.remove'))
      expect(handler).toHaveBeenCalledWith('department')
    })
  })

  describe('country branch', () => {
    it('renders a select row of countries for the country attribute', () => {
      renderEntry(attr({ name: COUNTRY_ATTR }), { [COUNTRY_ATTR]: 'US' })
      const row = screen.getByTestId('select-row')
      expect(row).toHaveAttribute('data-name', COUNTRY_ATTR)
      expect(row).toHaveAttribute('data-value', 'US')
      expect(Number(row.getAttribute('data-count'))).toBeGreaterThan(0)
    })
  })

  describe('input row branch', () => {
    it('renders a date input for the birthdate attribute', () => {
      renderEntry(attr({ name: BIRTHDATE_ATTR }), { [BIRTHDATE_ATTR]: '2000-01-01' })
      expect(screen.getByTestId('input-row')).toHaveAttribute('data-type', 'date')
    })

    it('renders a date input when the dataType is date', () => {
      renderEntry(attr({ name: 'anniversary', dataType: 'DATE' }), {})
      expect(screen.getByTestId('input-row')).toHaveAttribute('data-type', 'date')
    })

    it('renders a boolean input coercing the value to a boolean', () => {
      renderEntry(attr({ name: 'active', dataType: 'boolean' }), { active: 1 })
      const row = screen.getByTestId('input-row')
      expect(row).toHaveAttribute('data-boolean', 'true')
      expect(row).toHaveAttribute('data-value', 'true')
    })

    it('renders a plain text input for a generic string attribute', () => {
      renderEntry(attr({ name: 'nickname', dataType: 'string' }), { nickname: 'ace' })
      const row = screen.getByTestId('input-row')
      expect(row).toHaveAttribute('data-type', 'text')
      expect(row).toHaveAttribute('data-value', 'ace')
    })

    it('removes the claim via the remove handler', () => {
      const { handler } = renderEntry(attr({ name: 'nickname' }), {})
      fireEvent.click(screen.getByText('remove'))
      expect(handler).toHaveBeenCalledWith('nickname')
    })
  })
})
