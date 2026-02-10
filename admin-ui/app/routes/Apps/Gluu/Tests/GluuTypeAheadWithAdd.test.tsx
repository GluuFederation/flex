import React from 'react'
import GluuTypeAheadWithAdd from '../GluuTypeAheadWithAdd'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from './Components/AppTestWrapper.test'

it('Test GluuTypeAheadWithAdd component', async () => {
  const LABEL = 'fields.application_type'
  const NAME = 'applicationType'
  const VALUE = ['Monday']
  const OPTIONS = ['Monday', 'Tuesday']
  render(
    <AppTestWrapper>
      <GluuTypeAheadWithAdd
        doc_category="openid_client"
        name={NAME}
        value={VALUE}
        label={LABEL}
        options={OPTIONS}
      />
    </AppTestWrapper>,
  )
  expect(screen.getByText(/Application [Tt]ype/i)).toBeInTheDocument()
  expect(screen.getByText('Add')).toBeInTheDocument()
  expect(screen.getByText(VALUE[0])).toBeInTheDocument()
})
