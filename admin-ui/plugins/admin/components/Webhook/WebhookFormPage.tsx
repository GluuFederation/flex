import React, { memo, useMemo } from 'react'
import { useMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'
import SetTitle from 'Utils/SetTitle'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import WebhookForm from './WebhookForm'
import { useStyles } from './styles/WebhookFormPage.style'

const webhookResourceId = ADMIN_UI_RESOURCES.Webhooks

const WebhookFormPage: React.FC = () => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const { canRead: canReadWebhooks, canWrite: canWriteWebhooks } = usePermission(webhookResourceId)

  const addMatch = useMatch(ROUTES.WEBHOOK_ADD)
  const viewMatch = useMatch(ROUTES.WEBHOOK_VIEW_TEMPLATE)

  const isAdd = !!addMatch
  const viewOnly = !isAdd && (!!viewMatch || !canWriteWebhooks)

  const titleKey = useMemo(() => {
    if (isAdd) return 'messages.add_webhook'
    return viewOnly ? 'titles.view_webhook' : 'titles.edit_webhook'
  }, [isAdd, viewOnly])

  SetTitle(t(titleKey))

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={viewOnly ? canReadWebhooks : canWriteWebhooks}>
        <GluuText variant="h1" className={classes.mobilePageTitle}>
          {t(titleKey)}
        </GluuText>
        <div className={classes.formCard}>
          <div className={classes.content}>
            <WebhookForm viewOnly={viewOnly} />
          </div>
        </div>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default memo(WebhookFormPage)
