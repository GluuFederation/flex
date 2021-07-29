import React, { useState } from 'react'
import {
  FormGroup,
  Col,
  Input,
  Button,
  Modal,
  Divider,
  Badge,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import ClipLoader from "react-spinners/ClipLoader"

const GluuCommitDialog = ({ handler, modal, onAccept, formik, operations, label, placeholderLabel, inputType, isLoading }) => {
  const { t } = useTranslation()
  const [active, setActive] = useState(false)
  let [loading, setLoading] = useState(isLoading);
  const USER_MESSAGE = 'user_action_message'
  function handleStatus() {
    var value = document.getElementById(USER_MESSAGE).value
    if (value.length >= 10) {
      setActive(true)
    } else {
      setActive(false)
    }
  }

  function handleAccept() {
    if (formik) {
      formik.setFieldValue(
        'action_message',
        document.getElementById(USER_MESSAGE).value,
      )
    }
    console.log("loading:", loading, isLoading);
  //  setLoading(true);
    onAccept(document.getElementById(USER_MESSAGE).value)
  }
  return (
    <Modal isOpen={modal} toggle={handler} className="modal-outline-primary">
      <ModalHeader toggle={handler}>
        <i
          style={{ color: 'green' }}
          className="fa fa-2x fa-info fa-fw modal-icon mb-3"
        ></i>
        {(!label || label === '') ? t('messages.action_commit_question') : label}
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
              type={!!inputType ? inputType : "textarea"}
              name={USER_MESSAGE}
              onKeyUp={handleStatus}
              placeholder={(!placeholderLabel || placeholderLabel === '') ? t('placeholders.action_commit_message') : placeholderLabel}
              defaultValue=""
            />
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <ClipLoader loading={loading} size={35} />
        {active && (
          <Button color="primary" onClick={handleAccept}>
            <i className="fa fa-check-circle mr-2"></i>
            {t('actions.accept')}
          </Button>
        )}{' '}
        <Button color="danger" onClick={handler}>
          <i className="fa fa-remove mr-2"></i>
          {t('actions.no')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default GluuCommitDialog
