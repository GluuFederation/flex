import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyLayout } from './../../../components';
import { HeaderAuth } from '../../components/Pages/HeaderAuth';
import { FooterAuth } from '../../components/Pages/FooterAuth';
import { useTranslation } from 'react-i18next';

function Gluu404Error() {
  const { t } = useTranslation();
  return (
    <EmptyLayout>
      <EmptyLayout.Section center>
        <HeaderAuth
          title={t('messages.resource_not_found_title')}
          text={t('messages.resource_not_found_message')}
        />
        <div className="d-flex mb-5">
          <Link to="/">{t('actions.back_home')}</Link>
          <Link to="/" className="ml-auto text-decoration-none">
            {t('links.support')}
          </Link>
        </div>
        <FooterAuth />
      </EmptyLayout.Section>
    </EmptyLayout>
  );
}

export default Gluu404Error;
