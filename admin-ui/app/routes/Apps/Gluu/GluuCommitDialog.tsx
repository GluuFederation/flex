import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
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
import { useStyles } from './GluuCommitDialog.style'

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
  const isValid = messageLength >= 10 && messageLength <= 512
  const hasError = messageLength > 0 && (messageLength < 10 || messageLength > 512)

  const errorMessageText = useMemo(() => {
    if (messageLength < 10) {
      const remaining = 10 - messageLength
      return `${remaining} ${remaining === 1 ? 'character' : 'characters'} required (minimum 10)`
    }
    if (messageLength > 512) {
      const excess = messageLength - 512
      return `${excess} ${t('placeholders.charMoreThan512')}`
    }
    return ''
  }, [messageLength, t])

  const titleText = useMemo(() => {
    if (isLicenseLabel) return t('messages.licenseAuditLog')
    if (!label || label === '') return t('messages.action_commit_question_title')
    return label
  }, [isLicenseLabel, label, t])

  const placeholderText = useMemo(
    () => placeholderLabel || t('placeholders.provide_reason'),
    [placeholderLabel, t],
  )

  const handleAccept = useCallback(() => {
    if (formik) {
      formik.setFieldValue('action_message', userMessage)
    }
    onAccept(userMessage)
  }, [formik, onAccept, userMessage])

  const closeModal = useCallback(() => {
    handler()
    onCloseModal()
    setUserMessage('')
  }, [handler, onCloseModal])

  if (!modal) {
    return <></>
  }
  return (
    <>
      {(webhookModal || loadingWebhooks) && canReadWebhooks ? (
        <>{webhookTriggerModal({ closeModal })}</>
      ) : (
        <>
          <div className={classes.overlay} onClick={closeModal} />
          <div className={classes.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeModal}
              className={classes.closeButton}
              aria-label="Close"
            >
              <CloseOutlinedIcon />
            </button>
            <h2 className={classes.title}>{titleText}</h2>
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
            {hasError && <div className={classes.errorMessage}>{errorMessageText}</div>}
            <button
              type="button"
              onClick={handleAccept}
              className={classes.yesButton}
              disabled={!isValid}
            >
              {t('actions.yes')}
            </button>
          </div>
        </>
      )}
    </>
  )
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
