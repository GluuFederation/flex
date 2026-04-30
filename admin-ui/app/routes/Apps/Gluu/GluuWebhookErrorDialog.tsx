import { useMemo, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setShowErrorModal,
  setWebhookTriggerErrors,
  setTriggerWebhookResponse,
} from 'Plugins/admin/redux/features/WebhookSlice'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import customColors from '@/customColors'
import { useStyles } from './styles/GluuWebhookErrorDialog.style'
import { useStyles as useCommitDialogStyles } from './styles/GluuCommitDialog.style'
import GluuText from './GluuText'
import { GluuButton } from '@/components'
import type { WebhookTriggerResponseItem } from 'Plugins/admin/redux/types'

const GluuWebhookErrorDialog = () => {
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

  const { triggerWebhookMessage, webhookTriggerErrors, showErrorModal } = webhookState ?? {}

  const closeModal = useCallback(() => {
    dispatch(setShowErrorModal(false))
    dispatch(setWebhookTriggerErrors([]))
    dispatch(setTriggerWebhookResponse(''))
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

  if (!webhookState || !showErrorModal || !canReadWebhooks) return null

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
        className={commitClasses.modalContainer}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="webhook-error-dialog-title"
      >
        <button
          type="button"
          onClick={closeModal}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <i className="fa fa-times" aria-hidden />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText variant="h2" className={commitClasses.title} id="webhook-error-dialog-title">
            <i
              style={{ color: customColors.logo }}
              className="fa fa-info fa-fw me-2"
              aria-hidden="true"
            />
            {t('messages.webhook_execution_information')}
          </GluuText>
          {triggerWebhookMessage ? (
            <GluuText variant="p" disableThemeColor className={classes.errorMessage}>
              {triggerWebhookMessage}
            </GluuText>
          ) : null}
          {(webhookTriggerErrors?.length ?? 0) > 0 && (
            <ul className={classes.errorList}>
              {(webhookTriggerErrors ?? []).map((item: WebhookTriggerResponseItem, index) => (
                <li
                  key={`${item.responseObject?.webhookId ?? ''}-${item.responseObject?.webhookName ?? ''}-${index}`}
                  className={classes.errorItem}
                >
                  <span>
                    <span className={classes.errorLabel}>{t('fields.webhook_id')}:</span>{' '}
                    <span className={classes.errorValue}>{item.responseObject?.webhookId}</span>
                  </span>
                  <span>
                    <span className={classes.errorLabel}>{t('fields.webhook_name')}:</span>{' '}
                    <span className={classes.errorValue}>{item.responseObject?.webhookName}</span>
                  </span>
                  <span>
                    <span className={classes.errorLabel}>{t('messages.error_message')}:</span>{' '}
                    <span className={classes.errorValue}>{item.responseMessage}</span>
                  </span>
                </li>
              ))}
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
            >
              <i className="fa fa-check-circle me-2" aria-hidden />
              {t('actions.ok')}
            </GluuButton>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export default GluuWebhookErrorDialog
