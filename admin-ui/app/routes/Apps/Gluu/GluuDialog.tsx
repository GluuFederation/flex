import { useState, useEffect, use, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { useAppSelector } from '@/redux/hooks'
import { useWebhookDialogAction } from 'Utils/hooks'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import customColors from '@/customColors'
import { GluuButton } from '@/components'
import { GluuModalShell } from '@/components/GluuModalShell'
import { WarningAmberOutlined } from '@/components/icons'
import GluuText from './GluuText'
import { useStyles } from './styles/GluuDialog.style'
import { useStyles as useCommitDialogStyles } from './styles/GluuCommitDialog.style'
import type { GluuDialogProps } from './types'

const ACTION_MESSAGE_MIN_LENGTH = 10

const GluuDialog = ({ row, handler, modal, onAccept, subject, name, feature }: GluuDialogProps) => {
  const [active, setActive] = useState(false)
  const { t } = useTranslation()
  const { canRead: canReadWebhooks } = usePermission(ADMIN_UI_RESOURCES.Webhooks)

  const [userMessage, setUserMessage] = useState('')
  const webhookModal = useAppSelector((state) => state.webhookReducer?.webhookModal ?? false)
  const theme = use(ThemeContext)
  const selectedTheme = theme?.state.theme || DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  const { webhookTriggerModal, onCloseModal } = useWebhookDialogAction({
    feature,
    modal,
  })

  useEffect(() => {
    setActive(userMessage.length >= ACTION_MESSAGE_MIN_LENGTH)
  }, [userMessage])

  useEffect(() => {
    if (modal) {
      setUserMessage('')
    }
  }, [modal, row])

  const handleAccept = useCallback(() => {
    onAccept(userMessage)
  }, [onAccept, userMessage])

  const closeModal = useCallback(() => {
    handler()
    setUserMessage('')
    onCloseModal()
  }, [handler, onCloseModal])

  if (!modal) {
    return null
  }

  if (webhookModal && canReadWebhooks) {
    return <>{webhookTriggerModal({ closeModal })}</>
  }

  const charsRemaining = ACTION_MESSAGE_MIN_LENGTH - userMessage.length
  const helperText =
    userMessage.length < ACTION_MESSAGE_MIN_LENGTH
      ? `${charsRemaining}${userMessage.length ? ' more' : ''} characters required`
      : ''
  const titleSuffix = row.inum || row.id ? `-${row.inum || row.id}` : ''

  return (
    <GluuModalShell onClose={closeModal} ariaLabelledBy="gluu-dialog-title">
      <GluuText variant="h2" className={classes.title} id="gluu-dialog-title">
        <WarningAmberOutlined
          style={{ color: customColors.accentRed }}
          className={classes.warningIcon}
        />
        {`${t('messages.action_deletion_for')} ${subject} (${row.name || name || ''}${titleSuffix})`}
      </GluuText>
      <GluuText variant="p" className={classes.question}>
        {t('messages.action_deletion_question')}
      </GluuText>
      <div className={commitClasses.textareaContainer}>
        <textarea
          id="user_action_message"
          name="user_action_message"
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder={t('placeholders.action_commit_message')}
          value={userMessage}
          className={commitClasses.textarea}
          aria-describedby={helperText ? 'gluu-dialog-error' : undefined}
        />
      </div>
      <GluuText
        variant="span"
        className={commitClasses.errorMessage}
        style={{
          color: customColors.accentRed,
          visibility: helperText ? 'visible' : 'hidden',
        }}
        id="gluu-dialog-error"
      >
        {helperText || ' '}
      </GluuText>
      <div className={commitClasses.buttonRow}>
        {active && (
          <GluuButton theme="dark" onClick={handleAccept} className={commitClasses.yesButton}>
            {t('actions.yes')}
          </GluuButton>
        )}
        <GluuButton theme="dark" onClick={closeModal} className={commitClasses.noButton}>
          {t('actions.no')}
        </GluuButton>
      </div>
    </GluuModalShell>
  )
}

export default GluuDialog
