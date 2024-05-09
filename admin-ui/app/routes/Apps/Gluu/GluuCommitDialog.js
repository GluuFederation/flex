import React, { useState, useEffect, useContext } from 'react'
import {
  FormGroup,
  Col,
  Input,
  Button,
  Modal,
  Badge,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import useWebhookDialogAction from 'Utils/hooks/useWebhookDialogAction'
import { hasPermission, WEBHOOK_READ } from 'Utils/PermChecker'

const USER_MESSAGE = 'user_action_message'

const GluuCommitDialog = ({
  handler,
  modal,
  onAccept,
  formik,
  operations,
  label,
  placeholderLabel,
  inputType,
  feature,
}) => {
  const permissions = useSelector((state) => state.authReducer.permissions)
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [active, setActive] = useState(false)
  const [userMessage, setUserMessage] = useState('')
  const { loadingWebhooks, webhookModal } = useSelector(
    (state) => state.webhookReducer
  )

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

  function handleAccept() {
    if (formik) {
      formik.setFieldValue('action_message', userMessage)
    }
    onAccept(userMessage)
    setUserMessage('')
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
      {(webhookModal || loadingWebhooks) && hasPermission(permissions, WEBHOOK_READ) ? (
        <>{webhookTriggerModal({ closeModal })}</>
      ) : (
        <Modal
          isOpen={modal}
          size={'lg'}
          toggle={closeModal}
          className='modal-outline-primary'
        >
          <ModalHeader toggle={closeModal}>
            <i
              onClick={closeModal}
              onKeyDown={() => {}}
              style={{ color: 'green' }}
              className='fa fa-2x fa-info fa-fw modal-icon mb-3'
              role='img'
              aria-hidden='true'
            ></i>
            {!label || label === ''
              ? t('messages.action_commit_question')
              : label}
          </ModalHeader>
          <ModalBody>
            {operations && <FormGroup row>List of changes</FormGroup>}
            {operations &&
              operations.map((item, key) => (
                <FormGroup row key={key}>
                  <Col sm={1}>Set</Col>
                  <Col sm={5} style={{ overflow: 'auto' }}>
                    <Badge color={`primary-${selectedTheme}`}>
                      {item.path}
                    </Badge>
                  </Col>
                  <Col sm={1}>to</Col>
                  <Col sm={5} style={{ overflow: 'auto' }}>
                    {Array.isArray(item.value) ? (
                      <>
                        {item.value.map((data, index) => (
                          <Badge
                            color={`primary-${selectedTheme}`}
                            key={String(data)}
                          >
                            {String(data)}
                          </Badge>
                        ))}
                      </>
                    ) : (
                      <Badge color={`primary-${selectedTheme}`}>
                        {String(item.value)}
                      </Badge>
                    )}
                  </Col>
                </FormGroup>
              ))}
            <FormGroup row>
              <Col sm={12}>
                <Input
                  id={USER_MESSAGE}
                  type={inputType ? inputType : 'textarea'}
                  name={USER_MESSAGE}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder={
                    !placeholderLabel || placeholderLabel === ''
                      ? t('placeholders.action_commit_message')
                      : placeholderLabel
                  }
                  value={userMessage}
                />
                {userMessage.length < 10 && (
                  <span className='text-danger'>
                    {10 - userMessage.length}{' '}
                    {userMessage.length ? ' more' : ''} characters required
                  </span>
                )}
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {active && (
              <Button color={`primary-${selectedTheme}`} onClick={handleAccept}>
                <i className='fa fa-check-circle me-2'></i>
                {t('actions.accept')}
              </Button>
            )}{' '}
            <Button onClick={closeModal}>
              <i className='fa fa-remove me-2'></i>
              {t('actions.no')}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  )
}

export default GluuCommitDialog
GluuCommitDialog.propTypes = {
  feature: PropTypes.string,
  operations: PropTypes.any,
  handler: PropTypes.func,
  modal: PropTypes.bool.isRequired,
  onAccept: PropTypes.func,
  placeholderLabel: PropTypes.string,
  inputType: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.object
}
