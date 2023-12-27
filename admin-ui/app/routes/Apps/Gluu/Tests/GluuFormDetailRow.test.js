import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuFormDetailRow from '../GluuFormDetailRow'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
const LABEL = 'fields.application_type'
const NAME = 'application_type'
const VALUE = 'openid'

it('Should render one label and a badge', () => {
  function handler() {
    console.log("========")
  }
  render(
    <AppTestWrapper>
      <GluuFormDetailRow
        label={LABEL}
        value={VALUE}
        name={NAME}
        handler={handler}
      />
    </AppTestWrapper>,
  )
  screen.getByText(/Application Type/i)
  screen.getByText(VALUE)
})
