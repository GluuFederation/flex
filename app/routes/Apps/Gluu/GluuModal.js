import React from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from 'reactstrap'

function GluuModal({ title, modal, handler, onAccept}) {
  let uri = ''
  function savePress(e) {
    uri = document.getElementById('uri').value
  }
  return (
    <Modal isOpen={modal} toggle={handler} className="modal-outline-primary">
      <ModalHeader toggle={handler}>
        <i
          style={{ color: 'red' }}
          className="fa fa-2x fa-item fa-fw modal-icon mb-3"
        ></i>
        {title}
      </ModalHeader>
      <ModalBody>
        <Input placeholder="entry a redirect uri" />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onAccept}>
          Add
        </Button>
        &nbsp;
        <Button color="primary" onClick={handler}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default GluuModal
