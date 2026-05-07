import { useMemo, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setShowWebhookExecutionDialog,
  setWebhookTriggerResults,
} from 'Plugins/admin/redux/features/WebhookSlice'
import { Check, Close, InfoOutlined } from '@/components/icons'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import customColors from '@/customColors'
import { useStyles } from './styles/GluuWebhookExecutionDialog.style'
import { useStyles as useCommitDialogStyles } from './styles/GluuCommitDialog.style'
import GluuText from './GluuText'
import { GluuButton } from '@/components'
import type { WebhookTriggerResponseItem } from 'Plugins/admin/redux/types'
import GluuLoader from './GluuLoader'

const isWebhookSuccess = (item: WebhookTriggerResponseItem): boolean =>
  item.success === true || String(item.success).toLowerCase() === 'true'

const getWebhookName = (item: WebhookTriggerResponseItem): string =>
  item.responseObject?.webhookName ??
  item.responseObject?.webhookId ??
  item.responseObject?.inum ??
  ''

const GluuWebhookExecutionDialog = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const webhookState = useAppSelector((state) => state.webhookReducer)
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes } = useStyles({ isDark, themeColors })
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  const webhookResourceId = useMemo(() => ADMIN_UI_RESOURCES.Webhooks, [])
  const webhookScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[webhookResourceId], [webhookResourceId])
  const canReadWebhooks = useMemo(
    () => hasCedarReadPermission(webhookResourceId),
    [hasCedarReadPermission, webhookResourceId],
  )

  useEffect(() => {
    if (webhookScopes && webhookScopes.length > 0) {
      authorizeHelper(webhookScopes)
    }
  }, [authorizeHelper, webhookScopes])

  const {
    loadingWebhooks = false,
    triggerWebhookInProgress = false,
    webhookTriggerResults,
    showWebhookExecutionDialog,
  } = webhookState ?? {}
  const hasWebhookResults = (webhookTriggerResults?.length ?? 0) > 0
  const showWebhookLoader =
    loadingWebhooks ||
    triggerWebhookInProgress ||
    (showWebhookExecutionDialog && !hasWebhookResults)

  const closeModal = useCallback(() => {
    dispatch(setShowWebhookExecutionDialog(false))
    dispatch(setWebhookTriggerResults([]))
  }, [dispatch])

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
      }
    },
    [closeModal],
  )

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
      }
      e.stopPropagation()
    },
    [closeModal],
  )

  if (!webhookState || !canReadWebhooks) return null

  if (!showWebhookExecutionDialog || !hasWebhookResults) {
    return showWebhookLoader ? createPortal(<GluuLoader blocking />, document.body) : null
  }

  const modalContent = (
    <>
      <button
        type="button"
        className={commitClasses.overlay}
        onClick={closeModal}
        onKeyDown={handleOverlayKeyDown}
        aria-label={t('actions.close')}
      />
      <div
        className={`${commitClasses.modalContainer} ${classes.modalContainer}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="webhook-execution-dialog-title"
      >
        <button
          type="button"
          onClick={closeModal}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <Close fontSize="small" aria-hidden />
        </button>
        <div className={`${commitClasses.contentArea} ${classes.contentArea}`}>
          <GluuText variant="h2" className={classes.title} id="webhook-execution-dialog-title">
            <InfoOutlined
              style={{ color: customColors.logo }}
              className={classes.titleIcon}
              aria-hidden
            />
            {t('messages.webhook_execution_information')}
          </GluuText>
          {(webhookTriggerResults?.length ?? 0) > 0 && (
            <ul className={classes.resultList}>
              {(webhookTriggerResults ?? []).map((item: WebhookTriggerResponseItem, index) => {
                const isSuccess = isWebhookSuccess(item)
                return (
                  <li
                    key={`${item.responseObject?.webhookId ?? ''}-${getWebhookName(item)}-${index}`}
                    className={classes.resultItem}
                  >
                    <span>
                      <span className={classes.resultLabel}>{t('fields.webhook_name')}:</span>{' '}
                      <span className={classes.resultValue}>{getWebhookName(item)}</span>
                    </span>
                    <span>
                      <span className={classes.resultLabel}>{t('fields.status')}:</span>{' '}
                      <span className={isSuccess ? classes.successValue : classes.failedValue}>
                        {isSuccess ? t('messages.success') : t('messages.error')}
                      </span>
                    </span>
                    {!isSuccess && (
                      <>
                        <span>
                          <span className={classes.resultLabel}>{t('fields.webhook_id')}:</span>{' '}
                          <span className={classes.resultValue}>
                            {item.responseObject?.webhookId}
                          </span>
                        </span>
                        <span>
                          <span className={classes.resultLabel}>{t('fields.response_code')}:</span>{' '}
                          <span className={classes.resultValue}>{item.responseCode}</span>
                        </span>
                        <span>
                          <span className={classes.resultLabel}>
                            {t('messages.error_message')}:
                          </span>{' '}
                          <span className={classes.resultValue}>{item.responseMessage}</span>
                        </span>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
          <div className={classes.buttonRow}>
            <GluuButton
              onClick={closeModal}
              backgroundColor={themeColors.formFooter.back.backgroundColor}
              textColor={themeColors.formFooter.back.textColor}
              borderColor="transparent"
              padding="8px 28px"
              minHeight="40"
              useOpacityOnHover
              className={commitClasses.yesButton}
            >
              <Check fontSize="small" className={classes.actionIcon} aria-hidden />
              {t('actions.ok')}
            </GluuButton>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export default GluuWebhookExecutionDialog
