import { Link } from 'react-router-dom'
import { EmptyLayout } from 'Components'
import { HeaderAuth } from 'Routes/components/Pages/HeaderAuth'
import { FooterAuth } from 'Routes/components/Pages/FooterAuth'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/helpers/navigation'
import { useStyles } from './styles/Gluu404Error.style'

const Gluu404Error = () => {
  const { t } = useTranslation()
  const { classes } = useStyles()
  return (
    <EmptyLayout>
      <EmptyLayout.Section center>
        <HeaderAuth
          title={t('messages.resource_not_found_title')}
          text={t('messages.resource_not_found_message')}
        />
        <div className={classes.linkRow}>
          <Link to={ROUTES.ROOT}>{t('actions.back_home')}</Link>
          <Link to={ROUTES.ROOT} className={classes.supportLink}>
            {t('links.support')}
          </Link>
        </div>
        <FooterAuth />
      </EmptyLayout.Section>
    </EmptyLayout>
  )
}

export default Gluu404Error
