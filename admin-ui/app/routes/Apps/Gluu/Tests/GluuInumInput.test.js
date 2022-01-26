import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuInumInput from '../GluuInumInput'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'

const LABEL = 'fields.application_type'
const NAME = 'application_type'
const VALUE = 'Public'

it('Should show the disabled input with proper text wit sa', () => {
  function handler() {
    console.log("========");
  }
  render(
    <I18nextProvider i18n={i18n}>
      <GluuInumInput
        label={LABEL}
        value={VALUE}
        name={NAME}
        handler={handler}
        formik={handler}
      />
    </I18nextProvider>,
  )
  expect(screen.getByText(/Application Type/)).toBeInTheDocument()
  expect(screen.getByDisplayValue(VALUE).id).toBe(NAME)
  expect(screen.getByDisplayValue(VALUE)).toBeDisabled()
})
