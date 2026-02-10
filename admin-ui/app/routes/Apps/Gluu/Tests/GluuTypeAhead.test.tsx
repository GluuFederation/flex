import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuTypeAhead from '../GluuTypeAhead'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'

const LABEL = 'fields.application_type'
const NAME = 'applicationType'
const VALUE = ['Monday']
const OPTIONS = ['Monday', 'Tuesday']

it('Test gluu typeahead', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <GluuTypeAhead
        doc_category="openid_client"
        name={NAME}
        value={VALUE}
        label={LABEL}
        options={OPTIONS}
      />
    </I18nextProvider>,
  )
  expect(screen.getByText(/Application type/i)).toBeInTheDocument()
  expect(screen.getByText(VALUE[0])).toBeInTheDocument()
})
