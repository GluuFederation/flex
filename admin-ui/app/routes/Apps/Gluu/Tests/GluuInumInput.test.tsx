import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuInumInput from '../GluuInumInput'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

const LABEL = 'fields.application_type'
const NAME = 'application_type'
const VALUE = 'Public'

it('Should show the disabled input with proper text wit sa', () => {
  function handler() {
    console.log('========')
  }
  render(
    <AppTestWrapper>
      <GluuInumInput label={LABEL} value={VALUE} name={NAME} handler={handler} formik={handler} />
    </AppTestWrapper>,
  )
  expect(screen.getByText(/Application Type/i)).toBeInTheDocument()
  expect(screen.getByDisplayValue(VALUE).id).toBe(NAME)
  expect(screen.getByDisplayValue(VALUE)).toBeDisabled()
})
