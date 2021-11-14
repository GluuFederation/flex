import React from 'react'
import { render, screen} from '@testing-library/react'
import GluuFormDetailRow from '../GluuFormDetailRow'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
let LABEL = 'fields.application_type'
let NAME = 'application_type'
let VALUE = 'openid'

it('Should render one label and a badge', () => {
  function handler() {
    console.log("========");
  }
  render(
    <I18nextProvider i18n={i18n}>
      <GluuFormDetailRow
        label={LABEL}
        value={VALUE}
        name={NAME}
        handler={handler}
      />
    </I18nextProvider>,
  )
  screen.getByText('Application Type:')
  screen.getByText(VALUE)
})
