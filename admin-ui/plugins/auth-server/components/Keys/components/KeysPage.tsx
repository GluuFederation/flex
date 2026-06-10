import React, { useMemo, useCallback } from 'react'
import JwkListPage from './JwkListPage'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { GluuPageContent } from '@/components'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/KeysPage.style'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

const keysResourceId = ADMIN_UI_RESOURCES.Keys

const KeysPage: React.FC = () => {
  const { t } = useTranslation()
  const { canRead: canReadKeys } = usePermission(keysResourceId)
  const { navigateBack } = useAppNavigation()

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const handleBack = useCallback(() => {
    navigateBack(ROUTES.AUTH_SERVER_CONFIG_KEYS)
  }, [navigateBack])

  SetTitle(t('titles.public_keys'))

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canReadKeys}>
        <div className={classes.pageCard}>
          <JwkListPage classes={classes} />
        </div>
        <GluuThemeFormFooter showBack onBack={handleBack} showCancel={false} showApply={false} />
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

KeysPage.displayName = 'KeysPage'

export default KeysPage
