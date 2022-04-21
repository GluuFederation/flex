import React from 'react';
import GluuTypeAheadWithAdd from '../GluuTypeAheadWithAdd';
import { render, screen } from '@testing-library/react';
import i18n from '../../../../i18n';
import { I18nextProvider } from 'react-i18next';

it('Test GluuTypeAheadWithAdd component', () => {
  const LABEL = 'fields.application_type';
  const NAME = 'applicationType';
  const VALUE = ['Monday'];
  const OPTIONS = ['Monday', 'Tuesday'];
  render(
    <I18nextProvider i18n={i18n}>
      <GluuTypeAheadWithAdd
        doc_category="openid_client"
        name={NAME}
        value={VALUE}
        label={LABEL}
        options={OPTIONS}
      />
    </I18nextProvider>,
  );
  screen.getByText('Application Type:');
  screen.getByText('Add');
  screen.getByText('Remove');
  screen.getByText(VALUE[0]);
  screen.getByText('The OpenID connect Client application type.');
  expect(
    screen.getByText('The OpenID connect Client application type.'),
  ).toHaveAttribute('data-id', 'tooltip');
});
