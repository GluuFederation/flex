import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Paper from '@mui/material/Paper'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import customColors from '@/customColors'
import { GluuPageContent } from '@/components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import { useHealthStatus } from './hooks'
import ServiceStatusCard from './components/ServiceStatusCard'
import { useStyles } from './HealthPage.style'

const HealthPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.services_health'))

  const themeContext = useContext(ThemeContext)
  const currentTheme = themeContext?.state.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])

  const { services, healthyCount, totalCount, isLoading, isFetching, isError, refetch } =
    useHealthStatus()

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  const loading = isLoading || isFetching

  const healthThemeColors = useMemo(
    () => ({
      cardBg: isDark ? customColors.darkCardBg : customColors.white,
      navbarBorder:
        themeColors.navbar?.border ?? (isDark ? customColors.darkBorder : customColors.lightBorder),
      text: isDark ? customColors.white : customColors.primaryDark,
      refreshButtonBg: 'transparent',
      refreshButtonBorder: isDark ? customColors.white : customColors.primaryDark,
      refreshButtonText: isDark ? customColors.white : customColors.primaryDark,
    }),
    [isDark, themeColors.navbar?.border],
  )

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
              <GluuButton
                className={classes.refreshButton}
                onClick={handleRefresh}
                disabled={loading}
                outlined
                backgroundColor="transparent"
                borderColor={healthThemeColors.refreshButtonBorder}
                textColor={healthThemeColors.refreshButtonText}
                useOpacityOnHover
              >
                <i
                  className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`}
                  style={{ fontSize: 16 }}
                />
                {t('actions.refresh')}
              </GluuButton>
            </div>
            <div className={classes.headerDivider} />
          </div>

          {isError && (
            <div className={classes.messageBlock}>
              <i className="fa fa-exclamation-triangle" style={{ color: customColors.accentRed }} />
              <GluuText variant="span" style={{ color: customColors.accentRed }}>
                {t('messages.error_fetching_health_status')}
              </GluuText>
            </div>
          )}

          {!isLoading && !isError && services.length === 0 && (
            <div className={classes.messageBlock}>
              <i className="fa fa-info-circle" style={{ color: customColors.textSecondary }} />
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
