import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'Context/theme/themeContext'
import { THEME_DARK } from '@/context/theme/constants'
import PropTypes from 'prop-types'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useSelector } from 'react-redux'
import { useWebhookDialogAction } from 'Utils/hooks'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import type { RootState } from '@/redux/sagas/types/audit'
import type { GluuCommitDialogProps } from './types/index'
import customColors from '@/customColors'
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
}: GluuCommitDialogProps) => {
  const { t } = useTranslation()
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark })
  const [userMessage, setUserMessage] = useState('')
  const { loadingWebhooks, webhookModal } = useSelector((state: RootState) => state.webhookReducer)

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

  const prevModalRef = useRef<boolean>(false)
  useEffect(() => {
    if (modal && !prevModalRef.current) {
      setUserMessage('')
    }
    prevModalRef.current = modal
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

  const handleAccept = useCallback(() => {
    if (formik) {
      formik.setFieldValue('action_message', userMessage)
    }
    onAccept(userMessage)
    closeModal()
  }, [formik, onAccept, userMessage, closeModal])

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
    (webhookModal || loadingWebhooks) && canReadWebhooks ? (
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
          <GluuButton
            onClick={closeModal}
            className={classes.closeButton}
            backgroundColor="transparent"
            textColor={isDark ? customColors.white : customColors.primaryDark}
            borderColor="transparent"
            padding="0"
            minHeight="32"
            title={t('actions.close')}
          >
            <CloseOutlinedIcon />
          </GluuButton>
          <GluuText variant="h2" className={classes.title} id="commit-dialog-title">
            {titleText}
          </GluuText>
          <div className={classes.textareaContainer}>
            <textarea
              id={USER_MESSAGE}
              name={USER_MESSAGE}
              onChange={handleInputChange}
              placeholder={placeholderText}
              value={userMessage}
              className={classes.textarea}
            />
          </div>
          {errorMessageText && (
            <GluuText
              variant="span"
              className={classes.errorMessage}
              style={{ color: customColors.statusInactive }}
            >
              {errorMessageText}
            </GluuText>
          )}
          <GluuButton
            onClick={handleAccept}
            disabled={!isValid}
            backgroundColor={isDark ? customColors.statusActive : customColors.statusActiveBg}
            textColor={isDark ? customColors.white : customColors.statusActive}
            borderColor="transparent"
            padding="8px 28px"
            useOpacityOnHover
            className={classes.yesButton}
          >
            {t('actions.yes')}
          </GluuButton>
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
  isLicenseLabel: PropTypes.bool,
}
