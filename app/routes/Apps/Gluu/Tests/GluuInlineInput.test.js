import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GluuInlineInput from '../GluuInlineInput'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'

let LABEL = 'fields.application_type'
let NAME = 'application_type'
let VALUE = true

it('Should render a boolean select box', () => {
  function handler() {}
  render(
    <I18nextProvider i18n={i18n}>
      <GluuInlineInput
        label={LABEL}
        value={VALUE}
        name={NAME}
        isBoolean
        handler={handler}
      />
    </I18nextProvider>,
  )
  screen.getByText('Application Type:')
  fireEvent.click(screen.getByText(VALUE))
  fireEvent.click(screen.getByText(false))
})

it('Should render a typeahead component with array', () => {
  const VALUE = ['Two']
  const options = ['One', 'Two', 'Three']
  function handler() {}
  render(
    <I18nextProvider i18n={i18n}>
      <GluuInlineInput
        label={LABEL}
        value={VALUE}
        name={NAME}
        options={options}
        isArray
        handler={handler}
      />
    </I18nextProvider>,
  )
  screen.getByText('Application Type:')
  fireEvent.click(screen.getByText(VALUE))
})

it('Should render a text input', () => {
  const VALUE = 'Client Secret'
  function handler() {}
  render(
    <I18nextProvider i18n={i18n}>
      <GluuInlineInput
        label={LABEL}
        value={VALUE}
        name={NAME}
        handler={handler}
      />
    </I18nextProvider>,
  )
  screen.getByText('Application Type:')
  expect(screen.getByDisplayValue(VALUE).id).toBe(NAME)
})
