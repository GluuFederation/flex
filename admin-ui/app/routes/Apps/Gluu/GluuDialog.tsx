import { useState, useEffect, useContext } from 'react'
import {
  FormGroup,
  Col,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import useWebhookDialogAction from 'Utils/hooks/useWebhookDialogAction'
import { WEBHOOK_READ } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import customColors from '@/customColors'
import { useWebhookDialog } from '@/context/WebhookDialogContext'

const GluuDialog = ({ row, handler, modal, onAccept, subject, name, feature }: any) => {
  const [active, setActive] = useState(false)
  const { t } = useTranslation()
  const { hasCedarPermission } = useCedarling()

  const [userMessage, setUserMessage] = useState('')
  const { state: webhookState } = useWebhookDialog()
  const { loadingWebhooks, webhookModal } = webhookState
  const theme: any = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

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
      {(webhookModal || loadingWebhooks) && hasCedarPermission(WEBHOOK_READ) ? (
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
                  defaultValue=""
                  value={userMessage}
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
              <Button
                color={`primary-${selectedTheme}`}
                style={applicationStyle.buttonStyle}
                onClick={handleAccept}
              >
                {t('actions.yes')}
              </Button>
            )}{' '}
            <Button color={`primary-${selectedTheme}`} onClick={closeModal}>
              {t('actions.no')}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  )
}

export default GluuDialog
