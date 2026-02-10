import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuInputRow from '../GluuInputRow'
import AppTestWrapper from './Components/AppTestWrapper.test'

it('Should show the input with proper text', () => {
  const LABEL = 'fields.application_type'
  const NAME = 'application_type'
  const VALUE = 'Public'

  render(
    <AppTestWrapper>
      <GluuInputRow label={LABEL} value={VALUE} name={NAME} />
    </AppTestWrapper>,
  )
  expect(screen.getByText(/Application Type/i)).toBeInTheDocument()
  expect(screen.getByDisplayValue(VALUE).id).toBe(NAME)
})
