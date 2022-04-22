import React from 'react';
import GluuSecretDetail from '../GluuSecretDetail';
import { render, screen } from '@testing-library/react';
import i18n from '../../../../i18n';
import { I18nextProvider } from 'react-i18next';

it('Test GluuSecretDetail component', () => {
  const LABEL = 'fields.application_type';
  const VALUE = 'computer';
  render(
    <I18nextProvider i18n={i18n}>
      <GluuSecretDetail
        doc_category="openid_client"
        doc_entry="applicationType"
        value={VALUE}
        up
        label={LABEL}
      />
    </I18nextProvider>,
  );
  screen.getByText(/Application Type:/);
  screen.getByText('The OpenID connect Client application type.');
  expect(
    screen.getByText('The OpenID connect Client application type.'),
  ).toHaveAttribute('data-id', 'tooltip');
});
