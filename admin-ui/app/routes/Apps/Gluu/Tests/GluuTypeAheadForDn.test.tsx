import type { FormikProps } from 'formik'
import { render, screen } from '@testing-library/react'
import GluuTypeAheadForDn from '../GluuTypeAheadForDn'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '../../../../context/theme/themeContext'
import type { JsonValue } from '../types'

const LABEL = 'fields.application_type'
const NAME = 'applicationType'
const VALUE = [{ name: 'Monday', dn: '111111112222' }]
const OPTIONS = [
  { name: 'Monday', dn: '111111112222' },
  { name: 'Tuesday', dn: '1001112222' },
]

const mockFormik: Partial<FormikProps<Record<string, JsonValue>>> = {
  setFieldValue: jest.fn(),
}

it('Test gluu typeahead for dn', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <GluuTypeAheadForDn
          doc_category="openid_client"
          name={NAME}
          label={LABEL}
          options={OPTIONS}
          defaultSelected={VALUE}
          formik={mockFormik as FormikProps<Record<string, JsonValue>>}
        />
      </ThemeProvider>
    </I18nextProvider>,
  )
  expect(screen.getByText(/Application [Tt]ype/i)).toBeInTheDocument()
  expect(screen.getByText(/Monday/)).toBeInTheDocument()
})
