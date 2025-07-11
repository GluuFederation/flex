// @ts-nocheck
import React from 'react'
import GluuTypeAheadWithAdd from '../GluuTypeAheadWithAdd'
import { render, screen, waitFor } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import userEvent from '@testing-library/user-event'

it('Test GluuTypeAheadWithAdd component', async () => {
  const LABEL = 'fields.application_type'
  const NAME = 'applicationType'
  const VALUE = ['Monday']
  const OPTIONS = ['Monday', 'Tuesday']
  const { container } = render(
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
  screen.getByText(/Application Type/i)
  screen.getByText('Add')
  screen.getByText('Remove')
  screen.getByText(VALUE[0])
})
