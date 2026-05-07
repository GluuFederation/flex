import { useState, useEffect, useContext, useMemo } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { useAppSelector } from '@/redux/hooks'
import { useWebhookDialogAction } from 'Utils/hooks'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import customColors from '@/customColors'
import { GluuButton } from '@/components'
import { WarningAmberOutlined } from '@/components/icons'
import { useStyles } from './styles/GluuDialog.style'

import type { GluuDialogProps } from './types'

const GluuDialog = ({ row, handler, modal, onAccept, subject, name, feature }: GluuDialogProps) => {
  const [active, setActive] = useState(false)
  const { t } = useTranslation()
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const [userMessage, setUserMessage] = useState('')
  const loadingWebhooks = useAppSelector((state) => state.webhookReducer?.loadingWebhooks ?? false)
  const webhookModal = useAppSelector((state) => state.webhookReducer?.webhookModal ?? false)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const inverseTheme = isDark ? 'light' : 'dark'
  const inverseColors = getThemeColor(inverseTheme)
  const { classes } = useStyles()

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
    if (userMessage.length >= 10) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [userMessage])

  useEffect(() => {
    if (modal) {
      setUserMessage('')
    }
  }, [modal, row])

  const handleAccept = () => {
    onAccept(userMessage)
  }
  const closeModal = () => {
    handler()
    setUserMessage('')
    onCloseModal()
  }

  if (!modal) {
    return <></>
  }

  return (
    <>
      {(webhookModal || loadingWebhooks) && canReadWebhooks ? (
        <>{webhookTriggerModal({ closeModal })}</>
      ) : (
        <Dialog
          open={modal}
          onClose={closeModal}
          PaperProps={{ className: 'modal-outline-primary' }}
        >
          <DialogTitle>
            <WarningAmberOutlined
              style={{ color: customColors.accentRed }}
              className={`modal-icon ${classes.warningIcon}`}
            />
            {`${t('messages.action_deletion_for')} ${subject} (${row.name || name || ''}${row.inum || row.id ? `-${row.inum || row.id}` : ''})`}
          </DialogTitle>
          <DialogContent>
            <p>{t('messages.action_deletion_question')}</p>
            <TextField
              id="user_action_message"
              multiline
              rows={4}
              name="user_action_message"
              fullWidth
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder={t('placeholders.action_commit_message')}
              value={userMessage}
              sx={{ '& .MuiOutlinedInput-root': { borderColor: inverseColors.borderColor } }}
              helperText={
                userMessage.length < 10
                  ? `${10 - userMessage.length}${userMessage.length ? ' more' : ''} characters required`
                  : undefined
              }
              FormHelperTextProps={{ style: { color: customColors.accentRed } }}
            />
          </DialogContent>
          <DialogActions>
            {active && (
              <GluuButton theme="dark" onClick={handleAccept}>
                {t('actions.yes')}
              </GluuButton>
            )}
            <GluuButton theme="dark" onClick={closeModal}>
              {t('actions.no')}
            </GluuButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default GluuDialog
