import { use, useMemo } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import ArrowBack from '@mui/icons-material/ArrowBack'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { EmptyLayout } from 'Components'
import { LogoThemed } from 'Routes/components/LogoThemed/LogoThemed'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import customColors from '@/customColors'
import { EXTERNAL_LINKS } from '@/constants'
import { isDevelopment } from '@/utils/env'
import { createDate } from '@/utils/dayjsUtils'
import { useStyles } from './styles/GluuErrorScreen.style'

const basePath = process.env.BASE_PATH ?? '/admin'
const currentYear = createDate().year()

const GluuErrorScreen = ({ error }: FallbackProps) => {
  const { t } = useTranslation()
  const currentTheme = use(ThemeContext)?.state.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = useStyles({ themeColors })

  return (
    <EmptyLayout className={classes.screen}>
      {isDevelopment && (
        <details className={classes.errorOverlay}>
          <summary className={classes.errorSummary}>{t('actions.show_error')}</summary>
          <pre className={classes.errorStack}>
            {error instanceof Error ? (error.stack ?? error.message) : String(error)}
          </pre>
        </details>
      )}
      <div className={classes.scroller}>
        <div className={classes.root}>
          <LogoThemed width={153} height={60} />
          <svg
            className={classes.ghost}
            viewBox="0 0 90 106"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M0 37.5V105.5L11 91L22.5 105.5L33.5 91L44.5 105.5L55.5 91L67.5 105.5L78 91L89.5 105.5V39.5C88.3 8.3 60 0.166667 46 0C13.2 0 1.66667 25 0 37.5Z"
              fill={customColors.logo}
            />
            <circle cx="24.5" cy="40.5" r="9.5" fill={themeColors.background} />
            <circle cx="65.5" cy="40.5" r="9.5" fill={themeColors.background} />
          </svg>
          <GluuText variant="h1" className={classes.title}>
            {t('messages.crash_title')}
          </GluuText>
          <GluuText variant="p" secondary className={classes.message}>
            {t('messages.crash_message')}
          </GluuText>
          <hr className={classes.divider} />
          <div className={classes.actions}>
            <GluuButton
              backgroundColor={customColors.logo}
              textColor={customColors.white}
              borderColor={customColors.logo}
              fontWeight={700}
              minHeight={40}
              padding="0 28px"
              useOpacityOnHover
              style={{ letterSpacing: '0.28px' }}
              onClick={() => window.location.assign(basePath)}
            >
              <ArrowBack className={classes.buttonIcon} />
              {t('actions.back_to_home')}
            </GluuButton>
            <GluuButton
              outlined
              textColor={themeColors.fontColor}
              borderColor={themeColors.fontColor}
              fontWeight={700}
              minHeight={40}
              padding="0 28px"
              style={{ letterSpacing: '0.28px' }}
              onClick={() => window.open(EXTERNAL_LINKS.SUPPORT, '_blank', 'noopener,noreferrer')}
            >
              <OpenInNew className={classes.buttonIconSmall} />
              {t('actions.support_portal')}
            </GluuButton>
          </div>
          <GluuText variant="p" secondary className={classes.footer}>
            {t('messages.crash_footer_pre', { year: currentYear })}{' '}
            <GluuText variant="span" className={classes.footerCompany}>
              {t('footer.company_name')}
            </GluuText>{' '}
            {t('messages.crash_footer_post')}
          </GluuText>
        </div>
      </div>
    </EmptyLayout>
  )
}

export default GluuErrorScreen
