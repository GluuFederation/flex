import React, { useState, useEffect } from 'react'
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
import applicationStyle from './styles/applicationstyle'
import ClipLoader from 'react-spinners/ClipLoader'

const GluuCommitDialog = ({
  handler,
  modal,
  onAccept,
  formik,
  operations,
  label,
  placeholderLabel,
  inputType,
  isLoading,
}) => {
  const { t } = useTranslation()
  const [active, setActive] = useState(false)
  const [loading, setLoading] = useState(isLoading)
  const [userMessage, setUserMessage] = useState('')
  const USER_MESSAGE = 'user_action_message'
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
    setLoading(true)
    onAccept(userMessage)
    setTimeout(() => {
      setUserMessage('')
    }, 300)
  }
  const closeModal = () => {
    handler()
    setUserMessage('')
  }

  return (
    <Modal isOpen={modal} toggle={closeModal} className="modal-outline-primary">
      <ModalHeader toggle={closeModal}>
        <i
          style={{ color: 'green' }}
          className="fa fa-2x fa-info fa-fw modal-icon mb-3"
        ></i>
        {!label || label === '' ? t('messages.action_commit_question') : label}
      </ModalHeader>
      <ModalBody>
        {operations && <FormGroup row>List of changes</FormGroup>}
        {operations &&
          operations.map((item, key) => (
            <FormGroup row key={key}>
              <Col sm={1}>Set</Col>
              <Col sm={7}>
                <Badge color="primary">{item.path}</Badge>
              </Col>
              <Col sm={1}>to</Col>
              <Col sm={3}>
                <Badge color="primary">{String(item.value)}</Badge>
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
              <span className="text-danger">
                {10 - userMessage.length} {userMessage.length ? ' more' : ''}{' '}
                characters required
              </span>
            )}
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        {/* <ClipLoader loading={loading} size={35} /> */}
        {active && (
          <Button
            color="primary"
            style={applicationStyle.buttonStyle}
            onClick={handleAccept}
          >
            <i className="fa fa-check-circle mr-2"></i>
            {t('actions.accept')}
          </Button>
        )}{' '}
        <Button
          color="danger"
          style={applicationStyle.buttonStyle}
          onClick={closeModal}
        >
          <i className="fa fa-remove mr-2"></i>
          {t('actions.no')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default GluuCommitDialog
