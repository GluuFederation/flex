import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuTooltip from '../GluuTooltip'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'

it('Test gluutooltip', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <GluuTooltip doc_category="openid_client" doc_entry="applicationType">
        <p>A custom component</p>
      </GluuTooltip>
    </I18nextProvider>,
  )
  screen.getByText('A custom component')
  screen.getByText('The OpenID connect Client application type.')
  expect(
    screen.getByText('The OpenID connect Client application type.'),
  ).toHaveAttribute('data-id', 'tooltip')
})
