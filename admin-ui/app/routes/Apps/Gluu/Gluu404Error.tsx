import { Link } from 'react-router-dom'
import { EmptyLayout } from 'Components'
import { HeaderAuth } from 'Routes/components/Pages/HeaderAuth'
import { FooterAuth } from 'Routes/components/Pages/FooterAuth'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/helpers/navigation'

function Gluu404Error() {
  const { t } = useTranslation()
  return (
    <EmptyLayout>
      <EmptyLayout.Section center>
        <HeaderAuth
          title={t('messages.resource_not_found_title')}
          text={t('messages.resource_not_found_message')}
        />
        <div className="d-flex mb-5">
          <Link to={ROUTES.ROOT}>{t('actions.back_home')}</Link>
          <Link to={ROUTES.ROOT} className="ms-auto text-decoration-none">
            {t('links.support')}
          </Link>
        </div>
        <FooterAuth />
      </EmptyLayout.Section>
    </EmptyLayout>
  )
}

export default Gluu404Error
