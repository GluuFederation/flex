import React from 'react'
import { render, screen } from '@testing-library/react'
import {LanguageMenu} from '../LanguageMenu'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'

it('All supported languages will be visible', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <LanguageMenu />
    </I18nextProvider>,
  )
  screen.getByText('en')
  screen.getByText('French')
  screen.getByText('English')
  screen.getByText('Portuguese')
})
