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

const GluuCommitDialog = ({ handler, modal, onAccept, formik, operations }) => {
  const { t } = useTranslation()
  const [active, setActive] = useState(false)
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
    onAccept(document.getElementById(USER_MESSAGE).value)
  }
  return (
    <Modal isOpen={modal} toggle={handler} className="modal-outline-primary">
      <ModalHeader toggle={handler}>
        <i
          style={{ color: 'green' }}
          className="fa fa-2x fa-info fa-fw modal-icon mb-3"
        ></i>
        {t('messages.action_commit_question')}
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
                <Badge color="primary">{item.value}</Badge>
              </Col>
            </FormGroup>
          ))}
        <FormGroup row>
          <Col sm={12}>
            <Input
              id={USER_MESSAGE}
              type="textarea"
              name={USER_MESSAGE}
              onKeyUp={handleStatus}
              placeholder={t('placeholders.action_commit_message')}
              defaultValue=""
            />
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
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
