import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageMenu } from '../LanguageMenu'
import AppTestWrapper from './Components/AppTestWrapper.test'

it('All supported languages will be visible', () => {
  render(
    <AppTestWrapper>
      <LanguageMenu userInfo={{ inum: null }} />
    </AppTestWrapper>,
  )
  expect(screen.getByTestId('ACTIVE_LANG')).toHaveTextContent('EN')

  // Open the dropdown to reveal language options
  fireEvent.click(screen.getByRole('button'))

  expect(screen.getByText('French')).toBeInTheDocument()
  expect(screen.getByText('English')).toBeInTheDocument()
  expect(screen.getByText('Portuguese')).toBeInTheDocument()
})
