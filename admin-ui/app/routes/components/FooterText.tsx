import { useTranslation } from 'react-i18next'
import GluuText from 'Routes/Apps/Gluu/GluuText'

type FooterTextProps = {
  year: string | number
  name: string
}

const FooterText = ({ year, name }: FooterTextProps) => {
  const { t } = useTranslation()
  return (
    <GluuText variant="span">
      {t('footer.copyright', { year })} {t('footer.designed_by', { name })}{' '}
      <a
        href="https://www.gluu.org"
        target="_blank"
        rel="noopener noreferrer"
        className="sidebar__link"
      >
        {t('footer.company_name')}
      </a>
    </GluuText>
  )
}

export { FooterText }
export type { FooterTextProps }
