import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuAdvancedSearch from '../GluuAdvancedSearch'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'

it('Should render a required label with internationalized text', () => {
  const PATTERN_ID = 'patternId'
  const LIMIT_ID = 'limitId'
  const container = render(
    <I18nextProvider i18n={i18n}>
      <GluuAdvancedSearch patternId={PATTERN_ID} limitId={LIMIT_ID} />
    </I18nextProvider>,
  )
  screen.findAllByTestId(PATTERN_ID)
  //expect(container.firstChild).toHave
  //expect(screen.queryByT).toBeInTheDocument;
})
