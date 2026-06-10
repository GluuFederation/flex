import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import SetTitle from 'Utils/SetTitle'
import WebhookForm from './WebhookForm'
import { useStyles } from './styles/WebhookFormPage.style'

const webhookResourceId = ADMIN_UI_RESOURCES.Webhooks

const WebhookEditPage: React.FC = () => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const { canWrite: canWriteWebhooks } = usePermission(webhookResourceId)

  SetTitle(t('titles.edit_webhook', { defaultValue: 'Edit Webhook' }))

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canWriteWebhooks}>
        <div className={classes.formCard}>
          <div className={classes.content}>
            <WebhookForm />
          </div>
        </div>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default memo(WebhookEditPage)
