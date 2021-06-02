import React, { useState } from 'react'
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

const GluuCommitDialog = ({ handler, modal, onAccept, formik }) => {
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
        Audit log: Want to apply changes made on this page?
      </ModalHeader>
      <ModalBody>
        <FormGroup row>
          <Col sm={12}>
            <Input
              id={USER_MESSAGE}
              type="textarea"
              name={USER_MESSAGE}
              onKeyUp={handleStatus}
              placeholder="Provide the reason of this change"
              defaultValue=""
            />
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        {active && (
          <Button color="primary" onClick={handleAccept}>
            Accept
          </Button>
        )}{' '}
        <Button color="secondary" onClick={handler}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default GluuCommitDialog
