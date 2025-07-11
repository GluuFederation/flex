// @ts-nocheck
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import GluuTypeAhead from '../GluuTypeAhead'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
import userEvent from '@testing-library/user-event'

const LABEL = 'fields.application_type'
const NAME = 'applicationType'
const VALUE = ['Monday']
const OPTIONS = ['Monday', 'Tuesday']

it('Test gluu typeahead', async () => {
  const { container } = render(
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
  screen.getByText(/Application Type/i)
  screen.getByText(VALUE[0])
})
