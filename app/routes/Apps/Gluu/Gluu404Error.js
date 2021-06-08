import React from 'react'
import { Link } from 'react-router-dom'

import { EmptyLayout } from './../../../components'

import { HeaderAuth } from '../../components/Pages/HeaderAuth'
import { FooterAuth } from '../../components/Pages/FooterAuth'
import { useTranslation } from 'react-i18next'

function Gluu404Error() {
  const { t } = useTranslation();
  return (
    <EmptyLayout>
      <EmptyLayout.Section center>
        <HeaderAuth
          title={t("Error 404")}
          text={t("The requested resource doesn't exist on this server. Please contact the site administrator or the support team.")}
        />

        <div className="d-flex mb-5">
          <Link to="/">{t("Back to Home")}</Link>
          <Link to="/" className="ml-auto text-decoration-none">
            {t("Support")}
          </Link>
        </div>
        <FooterAuth />
      </EmptyLayout.Section>
    </EmptyLayout>
  )
}

export default Gluu404Error
