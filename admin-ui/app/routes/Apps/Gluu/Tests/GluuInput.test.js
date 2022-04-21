import React from 'react';
import { render, screen } from '@testing-library/react';
import GluuInput from '../GluuInput';
import i18n from '../../../../i18n';
import { I18nextProvider } from 'react-i18next';

it('Should show input text', () => {
  const LABEL = 'fields.application_type';
  const NAME = 'application_type';
  const VALUE = 'Public';
  render(
    <I18nextProvider i18n={i18n}>
      <GluuInput label={LABEL} value={VALUE} name={NAME} />
    </I18nextProvider>,
  );
  screen.getByText('Application Type:');
  expect(screen.getByDisplayValue(VALUE).id).toBe(NAME);
});
