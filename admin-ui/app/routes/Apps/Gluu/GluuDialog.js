import React, { useState, useEffect, useContext } from 'react'
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
import applicationStyle from '../../Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'

const GluuDialog = ({ row, handler, modal, onAccept, subject, name }) => {
  const [active, setActive] = useState(false)
  const { t } = useTranslation()
  const [userMessage, setUserMessage] = useState('')
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  useEffect(() => {
    if (userMessage.length >= 10) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [userMessage])

  function handleAccept() {
    onAccept(userMessage)
  }
  const closeModal = () => {
    handler()
    setUserMessage('')
  }
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={closeModal}
        className="modal-outline-primary"
      >
        <ModalHeader toggle={closeModal}>
          <i
            style={{ color: 'red' }}
            className="fa fa-2x fa-warning fa-fw modal-icon mb-3"
          ></i>
          {t('messages.action_deletion_for')} {subject} ({name}-{row.inum ? row.inum : row.id})
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
                <span className="text-danger">
                  {10 - userMessage.length} {userMessage.length ? ' more' : ''}{' '}
                  characters required
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
          <Button
            color={`primary-${selectedTheme}`}
            style={applicationStyle.buttonStyle}
            onClick={closeModal}
          >
            {t('actions.no')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default GluuDialog
