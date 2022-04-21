import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GluuInlineInput from '../GluuInlineInput';
import i18n from '../../../../i18n';
import { I18nextProvider } from 'react-i18next';

const LABEL = 'fields.application_type';
const NAME = 'application_type';
let VALUE = true;

function handler() {
  console.log('');
}

it('Should render a boolean select box', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <GluuInlineInput
        label={LABEL}
        value={VALUE}
        name={NAME}
        isBoolean
        handler={handler}
      />
    </I18nextProvider>,
  );
  expect(screen.getByText(/Application Type/)).toBeInTheDocument();
  fireEvent.click(screen.getByText(VALUE));
  fireEvent.click(screen.getByText(false));
});

it('Should render a typeahead component with array', () => {
  VALUE = ['Two'];
  const options = ['One', 'Two', 'Three'];
  render(
    <I18nextProvider i18n={i18n}>
      <GluuInlineInput
        label={LABEL}
        value={VALUE}
        name={NAME}
        options={options}
        isArray
        handler={handler}
      />
    </I18nextProvider>,
  );
  expect(screen.getByText(/Application Type/)).toBeInTheDocument();
  fireEvent.click(screen.getByText(VALUE));
});

it('Should render a text input', () => {
  VALUE = 'Client Secret';
  render(
    <I18nextProvider i18n={i18n}>
      <GluuInlineInput
        label={LABEL}
        value={VALUE}
        name={NAME}
        handler={handler}
      />
    </I18nextProvider>,
  );
  expect(screen.getByText(/Application Type/)).toBeInTheDocument();
  expect(screen.getByDisplayValue(VALUE).id).toBe(NAME);
  expect(screen.getByDisplayValue(VALUE).id).toBe(NAME);
});
