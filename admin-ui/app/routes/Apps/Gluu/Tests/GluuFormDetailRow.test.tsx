import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuFormDetailRow from '../GluuFormDetailRow'
import AppTestWrapper from './Components/AppTestWrapper.test'

const LABEL = 'fields.application_type'
const VALUE = 'openid'

it('Should render one label and a badge', () => {
  render(
    <AppTestWrapper>
      <GluuFormDetailRow label={LABEL} value={VALUE} />
    </AppTestWrapper>,
  )
  expect(screen.getByText(/Application [Tt]ype/i)).toBeInTheDocument()
  expect(screen.getByText(VALUE)).toBeInTheDocument()
})
