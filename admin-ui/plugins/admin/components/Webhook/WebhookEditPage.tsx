import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import SetTitle from 'Utils/SetTitle'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import WebhookForm from './WebhookForm'
import { useStyles } from './WebhookFormPage.style'

const WebhookEditPage: React.FC = () => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const { hasCedarReadPermission } = useCedarling()
  const webhookResourceId = useMemo(() => ADMIN_UI_RESOURCES.Webhooks, [])
  const canReadWebhooks = useMemo(
    () => hasCedarReadPermission(webhookResourceId),
    [hasCedarReadPermission, webhookResourceId],
  )

  SetTitle(t('titles.edit_webhook', { defaultValue: 'Edit Webhook' }))

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canReadWebhooks}>
        <div className={classes.formCard}>
          <div className={classes.header}>
            <GluuText variant="h1" className={classes.headerTitle}>
              {t('titles.edit_webhook', { defaultValue: 'Edit Webhook' })}
            </GluuText>
            <div className={classes.headerDivider} />
          </div>
          <div className={classes.content}>
            <WebhookForm variant="page" />
          </div>
        </div>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default memo(WebhookEditPage)
