import React from 'react'
import GluuViewWrapper from '../GluuViewWrapper'
import { render, screen } from '@testing-library/react'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'

it('Check view wrapper with show', () => {
  const componentText = 'the wrapped component'
  render(
    <I18nextProvider i18n={i18n}>
      <GluuViewWrapper canShow>
        <p>{componentText}</p>
      </GluuViewWrapper>
    </I18nextProvider>,
  )
  expect(screen.getByTestId('WRAPPER')).toHaveTextContent(componentText)
})

it('Check view wrapper with no show', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <GluuViewWrapper />
    </I18nextProvider>,
  )
  expect(screen.getByTestId('MISSING')).toHaveTextContent(
    'Missing required permission',
  )
})
