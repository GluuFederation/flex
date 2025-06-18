// @ts-nocheck
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import GluuTypeAheadForDn from '../GluuTypeAheadForDn'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
import userEvent from '@testing-library/user-event'

const LABEL = 'fields.application_type'
const NAME = 'applicationType'
const VALUE = [{ name: 'Monday', dn: '111111112222' }]
const OPTIONS = [
  { name: 'Monday', dn: '111111112222' },
  { name: 'Tuesday', dn: '1001112222' },
]

it('Test gluu typeahead for dn', async () => {
  const { container } = render(
    <I18nextProvider i18n={i18n}>
      <GluuTypeAheadForDn
        doc_category="openid_client"
        name={NAME}
        value={VALUE}
        label={LABEL}
        options={OPTIONS}
      />
    </I18nextProvider>,
  )
  screen.getByText('Application Type:', { exact: false })
  screen.getByText(VALUE[0].name)
})
