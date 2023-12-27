import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuInput from '../GluuInput'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

it('Should show input text', () => {
  const LABEL = 'fields.application_type'
  const NAME = 'application_type'
  const VALUE = 'Public'
  render(
    <AppTestWrapper>
      <GluuInput label={LABEL} value={VALUE} name={NAME} />
    </AppTestWrapper>,
  )
  screen.getByText(/Application Type/i)
  expect(screen.getByDisplayValue(VALUE).id).toBe(NAME)
})
