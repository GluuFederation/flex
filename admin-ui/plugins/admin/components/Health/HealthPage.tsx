import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Paper from '@mui/material/Paper'
import SetTitle from 'Utils/SetTitle'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuRefreshButton } from '@/components/GluuSearchToolbar'
import { useHealthStatus } from './hooks'
import ServiceStatusCard from './components/ServiceStatusCard'
import { useStyles } from './HealthPage.style'

const HealthPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.services_health'))

  const { state: themeState } = useTheme()
  const currentTheme = themeState?.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])

  const { services, healthyCount, totalCount, isLoading, isFetching, isError, refetch } =
    useHealthStatus()

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  const loading = isLoading || isFetching

  const healthThemeColors = useMemo(
    () => ({
      cardBg: themeColors.settings?.cardBackground ?? themeColors.card.background,
      navbarBorder: themeColors.navbar?.border ?? themeColors.borderColor,
      text: themeColors.fontColor,
      errorColor: themeColors.errorColor,
      infoMessageColor: themeColors.textMuted,
    }),
    [themeColors],
  )

  const isDark = currentTheme === THEME_DARK
  const { classes } = useStyles({ themeColors: healthThemeColors, isDark })

  return (
    <GluuLoader blocking={loading}>
      <GluuPageContent>
        <Paper elevation={0} className={classes.healthCard}>
          <div className={classes.header}>
            {!isLoading && !isError && totalCount > 0 && (
              <GluuText variant="div" className={classes.headerTitle}>
                {t('messages.services_healthy_count', { healthyCount, totalCount })}
              </GluuText>
            )}
            <div className={classes.refreshButtonWrapper}>
              <GluuRefreshButton
                className={classes.refreshButton}
                onClick={handleRefresh}
                loading={loading}
              />
            </div>
            <div className={classes.headerDivider} />
          </div>

          {isError && (
            <div className={`${classes.messageBlock} ${classes.errorMessage}`}>
              <i className={`fa fa-exclamation-triangle ${classes.errorIcon}`} />
              <GluuText variant="span">{t('messages.error_fetching_health_status')}</GluuText>
            </div>
          )}

          {!isLoading && !isError && services.length === 0 && (
            <div className={`${classes.messageBlock} ${classes.infoMessage}`}>
              <i className={`fa fa-info-circle ${classes.infoIcon}`} />
              <GluuText variant="span" secondary>
                {t('messages.no_services_found')}
              </GluuText>
            </div>
          )}

          {!isLoading && !isError && services.length > 0 && (
            <div className={classes.servicesGrid}>
              {services.map((service) => (
                <div key={service.name} className={classes.serviceCardWrapper}>
                  <ServiceStatusCard service={service} isDark={isDark} />
                </div>
              ))}
            </div>
          )}
        </Paper>
      </GluuPageContent>
    </GluuLoader>
  )
}

export default HealthPage
