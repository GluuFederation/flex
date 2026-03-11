import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useWebhookDialogAction } from 'Utils/hooks'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import type { RootState } from '@/redux/sagas/types/audit'
import type { GluuCommitDialogProps } from './types/index'
import { useStyles } from './styles/GluuCommitDialog.style'
import {
  getCommitMessageValidationError,
  COMMIT_MESSAGE_MIN_LENGTH,
  COMMIT_MESSAGE_MAX_LENGTH,
} from '@/utils/validation/commitMessage'
import GluuText from './GluuText'
import { GluuButton } from '@/components'

const USER_MESSAGE = 'user_action_message'

const GluuCommitDialog = ({
  handler,
  modal,
  onAccept,
  formik,
  label,
  placeholderLabel,
  feature,
  isLicenseLabel = false,
  operations = [],
  autoCloseOnAccept = false,
}: GluuCommitDialogProps) => {
  const { t } = useTranslation()
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const hasOperations = operations.length > 0
  const { classes } = useStyles({ isDark, themeColors })
  const [userMessage, setUserMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { webhookModal } = useSelector((state: RootState) => state.webhookReducer)

  const webhookResourceId = useMemo(() => ADMIN_UI_RESOURCES.Webhooks, [])
  const webhookScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[webhookResourceId] || [],
    [webhookResourceId],
  )
  const canReadWebhooks = useMemo(
    () => hasCedarReadPermission(webhookResourceId),
    [hasCedarReadPermission, webhookResourceId],
  )

  useEffect(() => {
    if (webhookScopes && webhookScopes.length > 0) {
      authorizeHelper(webhookScopes)
    }
  }, [authorizeHelper, webhookScopes])

  const { webhookTriggerModal, onCloseModal } = useWebhookDialogAction({
    feature,
    modal,
  })

  useEffect(() => {
    if (modal) {
      setUserMessage('')
    }
  }, [modal])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value)
  }, [])

  const messageLength = userMessage.length
  const isValid =
    messageLength >= COMMIT_MESSAGE_MIN_LENGTH && messageLength <= COMMIT_MESSAGE_MAX_LENGTH
  const errorMessageText = useMemo(
    () => getCommitMessageValidationError(messageLength, t),
    [messageLength, t],
  )

  const titleText = useMemo(() => {
    if (isLicenseLabel) return t('messages.licenseAuditLog')
    if (!label || label === '') return t('messages.action_commit_question_title')
    return label
  }, [isLicenseLabel, label, t])

  const placeholderText = useMemo(
    () => placeholderLabel || t('placeholders.action_commit_message'),
    [placeholderLabel, t],
  )

  const closeModal = useCallback(() => {
    handler()
    onCloseModal()
    setUserMessage('')
  }, [handler, onCloseModal])

  const handleAccept = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    if (formik) {
      formik.setFieldValue('action_message', userMessage)
    }
    try {
      const result = onAccept(userMessage)
      await Promise.resolve(result)
      if (!autoCloseOnAccept) {
        closeModal()
      }
    } finally {
      setIsSubmitting(false)
      if (autoCloseOnAccept) {
        closeModal()
      }
    }
  }, [formik, onAccept, userMessage, closeModal, isSubmitting, autoCloseOnAccept])

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
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

  if (!modal) {
    return <></>
  }

  const modalContent =
    webhookModal && canReadWebhooks ? (
      <>{webhookTriggerModal({ closeModal })}</>
    ) : (
      <>
        <button
          type="button"
          className={classes.overlay}
          onClick={closeModal}
          onKeyDown={handleOverlayKeyDown}
          aria-label={t('actions.close')}
        />
        <div
          className={classes.modalContainer}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          tabIndex={-1}
          aria-labelledby="commit-dialog-title"
        >
          <button
            type="button"
            onClick={closeModal}
            className={classes.closeButton}
            aria-label={t('actions.close')}
            title={t('actions.close')}
          >
            <i className="fa fa-times" aria-hidden />
          </button>
          <div className={classes.contentArea}>
            <GluuText variant="h2" className={classes.title} id="commit-dialog-title">
              {titleText}
            </GluuText>
            {hasOperations && (
              <div className={classes.operationsList}>
                <GluuText variant="h5" className={classes.operationsTitle}>
                  {t('messages.list_of_changes')}
                </GluuText>
                {operations.map((operation) => (
                  <div key={operation.path} className={classes.operationRow}>
                    <span className={classes.operationLabel}>{t('set')}</span>
                    <span className={classes.operationBadge}>{operation.path}</span>
                    <span className={classes.operationLabel}>{t('to')}</span>
                    <span className={classes.operationBadge}>
                      {operation.value === null || operation.value === ''
                        ? '""'
                        : String(operation.value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className={classes.textareaContainer}>
              <textarea
                id={USER_MESSAGE}
                name={USER_MESSAGE}
                onChange={handleInputChange}
                placeholder={placeholderText}
                value={userMessage}
                className={classes.textarea}
                aria-invalid={!!errorMessageText}
                aria-describedby={errorMessageText ? `${USER_MESSAGE}-error` : undefined}
              />
            </div>
            <GluuText
              variant="span"
              className={classes.errorMessage}
              style={{
                color: themeColors.settings.removeButton.bg,
                visibility: errorMessageText ? 'visible' : 'hidden',
              }}
              id={`${USER_MESSAGE}-error`}
            >
              {errorMessageText || '\u00A0'}
            </GluuText>
            <div className={classes.buttonRow}>
              <GluuButton
                onClick={handleAccept}
                disabled={!isValid || isSubmitting}
                backgroundColor={themeColors.formFooter.back.backgroundColor}
                textColor={themeColors.formFooter.back.textColor}
                borderColor="transparent"
                padding="8px 28px"
                minHeight="40"
                useOpacityOnHover
                className={classes.yesButton}
              >
                {t('actions.yes')}
              </GluuButton>
            </div>
          </div>
        </div>
      </>
    )

  return createPortal(modalContent, document.body)
}

export default GluuCommitDialog
GluuCommitDialog.propTypes = {
  feature: PropTypes.string,
  handler: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  onAccept: PropTypes.func.isRequired,
  formik: PropTypes.object,
  placeholderLabel: PropTypes.string,
  label: PropTypes.string,
  alertMessage: PropTypes.string,
  alertSeverity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  inputType: PropTypes.oneOf([
    'text',
    'textarea',
    'email',
    'password',
    'number',
    'tel',
    'url',
    'search',
  ]),
  isLicenseLabel: PropTypes.bool,
}
