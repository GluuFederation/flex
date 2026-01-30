import { useState, useEffect, useContext, useMemo } from 'react'
import { FormGroup, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { useSelector } from 'react-redux'
import { useWebhookDialogAction } from 'Utils/hooks'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import customColors from '@/customColors'
import { GluuButton } from '@/components'

const GluuDialog = ({ row, handler, modal, onAccept, subject, name, feature }: any) => {
  const [active, setActive] = useState(false)
  const { t } = useTranslation()
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const [userMessage, setUserMessage] = useState('')
  const { loadingWebhooks, webhookModal } = useSelector((state: any) => state.webhookReducer)
  const theme: any = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const inverseTheme = isDark ? 'light' : 'dark'
  const inverseColors = getThemeColor(inverseTheme)

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

  // Reset user message when modal opens with a new item
  useEffect(() => {
    if (modal) {
      setUserMessage('')
    }
  }, [modal, row])

  function handleAccept() {
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
        <Modal isOpen={modal} toggle={closeModal} className="modal-outline-primary">
          <ModalHeader toggle={closeModal}>
            <i
              style={{ color: customColors.accentRed }}
              className="fa fa-2x fa-warning fa-fw modal-icon mb-3"
            ></i>
            {`${t('messages.action_deletion_for')} ${subject} (${row.name || name || ''}${row.inum || row.id ? `-${row.inum || row.id}` : ''})`}
          </ModalHeader>
          <ModalBody>{t('messages.action_deletion_question')}</ModalBody>
          <ModalBody>
            <FormGroup row>
              <Col sm={12}>
                <Input
                  id="user_action_message"
                  type="textarea"
                  name="user_action_message"
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder={t('placeholders.action_commit_message')}
                  value={userMessage}
                  style={{ borderColor: inverseColors.borderColor }}
                />
                {userMessage.length < 10 && (
                  <span
                    style={{
                      color: customColors.accentRed,
                    }}
                  >
                    {10 - userMessage.length} {userMessage.length ? ' more' : ''} characters
                    required
                  </span>
                )}
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {active && (
              <GluuButton theme="dark" onClick={handleAccept}>
                {t('actions.yes')}
              </GluuButton>
            )}
            <GluuButton theme="dark" onClick={closeModal}>
              {t('actions.no')}
            </GluuButton>
          </ModalFooter>
        </Modal>
      )}
    </>
  )
}

export default GluuDialog
