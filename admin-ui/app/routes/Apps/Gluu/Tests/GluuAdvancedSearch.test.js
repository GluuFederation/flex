import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuAdvancedSearch from '../GluuAdvancedSearch'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'

it('Should render two inputs with proper ids', () => {
  const PATTERN_ID = 'patternId'
  const LIMIT_ID = 'limitId'
  const LIMIT =1000;
  render(
    <I18nextProvider i18n={i18n}>
      <GluuAdvancedSearch patternId={PATTERN_ID} limitId={LIMIT_ID} limit={LIMIT} />
    </I18nextProvider>,
  )
  
  expect(screen.getByDisplayValue("").id).toBe(PATTERN_ID);
  expect(screen.getByDisplayValue(LIMIT).id).toBe(LIMIT_ID);
})
