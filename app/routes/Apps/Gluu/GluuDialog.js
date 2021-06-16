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
import { useTranslation } from 'react-i18next'

const GluuDialog = ({ row, handler, modal, onAccept, subject, name }) => {
  const [active, setActive] = useState(false)
  const { t } = useTranslation()

  function handleStatus() {
    var value = document.getElementById('user_action_message').value
    if (value.length >= 10) {
      setActive(true)
    } else {
      setActive(false)
    }
  }

  function handleAccept() {
    onAccept(document.getElementById('user_action_message').value)
  }
  return (
    <div>
      <Modal isOpen={modal} toggle={handler} className="modal-outline-primary">
        <ModalHeader toggle={handler}>
          <i
            style={{ color: 'red' }}
            className="fa fa-2x fa-warning fa-fw modal-icon mb-3"
          ></i>
          {t("Deletion confirmation for")} {" "} {subject} ({name}-{row.inum})
        </ModalHeader>
        <ModalBody>{t("Do you really want to delete this item?")}</ModalBody>
        <ModalBody>
          <FormGroup row>
            <Col sm={12}>
              <Input
                id="user_action_message"
                type="textarea"
                name="user_action_message"
                onKeyUp={handleStatus}
                placeholder={t("Provide the reason of this change")}
                defaultValue=""
              />
            </Col>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {active && (
            <Button color="primary" onClick={handleAccept}>
              {t("Yes")}
            </Button>
          )}{' '}
          <Button color="secondary" onClick={handler}>
            {t("No")}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default GluuDialog
