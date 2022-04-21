import React from 'react';
import { render, screen } from '@testing-library/react';
import GluuLabel from '../GluuLabel';
import i18n from '../../../../i18n';
import { I18nextProvider } from 'react-i18next';

it('Should render a required label with internationalized text', () => {
  const labelText = 'fields.application_type';
  render(
    <I18nextProvider i18n={i18n}>
      <GluuLabel label={labelText} required />
    </I18nextProvider>,
  );
  expect(screen.getByText(/Application Type */)).toBeInTheDocument();
});

it('Should render the label with internationalized text', () => {
  const labelText = 'fields.application_type';
  render(
    <I18nextProvider i18n={i18n}>
      <GluuLabel label={labelText} />
    </I18nextProvider>,
  );
  expect(screen.getByText(/Application Type/)).toBeInTheDocument();
});

it('Should render the label with internationalized text and tooltip support', () => {
  const labelText = 'fields.application_type';
  render(
    <I18nextProvider i18n={i18n}>
      <GluuLabel
        label={labelText}
        doc_category="openid_client"
        doc_entry="applicationType"
      />
    </I18nextProvider>,
  );
  expect(screen.getByText(/Application Type/)).toBeInTheDocument();
  expect(
    screen.getByText(/The OpenID connect Client application type/),
  ).toBeInTheDocument();
});
