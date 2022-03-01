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
  let [loading, setLoading] = useState(isLoading)
  const [userMeggage, setUserMessage] = useState('')
  const USER_MESSAGE = 'user_action_message'
  useEffect(() => {
    if (userMeggage.length >= 10) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [userMeggage])
  function handleAccept() {
    if (formik) {
      formik.setFieldValue('action_message', userMeggage)
    }
    setLoading(true)
    onAccept(userMeggage)
  }
  return (
    <Modal isOpen={modal} toggle={handler} className="modal-outline-primary">
      <ModalHeader toggle={handler}>
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
              type={!!inputType ? inputType : 'textarea'}
              name={USER_MESSAGE}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder={
                !placeholderLabel || placeholderLabel === ''
                  ? t('placeholders.action_commit_message')
                  : placeholderLabel
              }
              defaultValue=""
            />
            {userMeggage.length <= 10 && (
              <span className="text-danger">
                {10 - userMeggage.length} {userMeggage.length ? ' more' : ''}{' '}
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
          onClick={handler}
        >
          <i className="fa fa-remove mr-2"></i>
          {t('actions.no')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default GluuCommitDialog
