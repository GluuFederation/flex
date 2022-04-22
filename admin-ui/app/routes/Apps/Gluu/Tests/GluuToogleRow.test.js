import React from 'react';
import { render, screen } from '@testing-library/react';
import GluuToogleRow from '../GluuToogleRow';
import i18n from '../../../../i18n';
import { I18nextProvider } from 'react-i18next';
const LABEL = 'fields.application_type';
const NAME = 'applicationType';
const VALUE = false;
function formikf() {
  console.console('=========');
}

it('Test gluutooltip', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <GluuToogleRow
        label={LABEL}
        name={NAME}
        value={VALUE}
        doc_category="openid_client"
        formik={formikf}
      />
    </I18nextProvider>,
  );
  screen.getByText('The OpenID connect Client application type.');
  expect(
    screen.getByText('The OpenID connect Client application type.'),
  ).toHaveAttribute('data-id', 'tooltip');
});
