import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageMenu } from '../LanguageMenu'
import AppTestWrapper from './Components/AppTestWrapper'

it('All supported languages will be visible', () => {
  render(
    <AppTestWrapper>
      <LanguageMenu userInfo={{ inum: undefined }} />
    </AppTestWrapper>,
  )
  expect(screen.getByTestId('ACTIVE_LANG')).toHaveTextContent('EN')

  fireEvent.click(screen.getByRole('button', { name: /en/i }))

  expect(screen.getByText('French')).toBeInTheDocument()
  expect(screen.getByText('English')).toBeInTheDocument()
  expect(screen.getByText('Portuguese')).toBeInTheDocument()
})
