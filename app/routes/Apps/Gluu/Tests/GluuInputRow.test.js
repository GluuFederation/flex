import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuInputRow from '../GluuInputRow'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
import { Formik } from 'formik'

it('Should show the input with proper text', () => {
    const LABEL = 'fields.application_type'
    const NAME = 'application_type'
    const VALUE = 'Public'
    function handler(){
    }
    render(
      <I18nextProvider i18n={i18n}>
        <GluuInputRow label={LABEL} value={VALUE} name={NAME} handler={handler} formik={handler}/>
      </I18nextProvider>,
    )
    screen.getByText('Application Type:')
    expect(screen.getByDisplayValue(VALUE).id).toBe(NAME)
  })