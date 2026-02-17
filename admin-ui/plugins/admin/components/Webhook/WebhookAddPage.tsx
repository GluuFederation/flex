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
import WebhookForm from './WebhookForm'
import { useStyles } from './styles/WebhookFormPage.style'

const WebhookAddPage: React.FC = () => {
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

  SetTitle(t('titles.add_webhook', { defaultValue: 'Add Webhook' }))

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canReadWebhooks}>
        <div className={classes.formCard}>
          <div className={classes.content}>
            <WebhookForm />
          </div>
        </div>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default memo(WebhookAddPage)
