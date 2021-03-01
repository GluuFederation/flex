import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const GluuDialog = ({ row, handler, modal, onAccept, subject }) => {
  return (
    <div>
      <Modal isOpen={modal} toggle={handler} className="modal-outline-primary">
        <ModalHeader toggle={handler}>
          <i
            style={{ color: 'red' }}
            className="fa fa-2x fa-warning fa-fw modal-icon mb-3"
          ></i>
          Deletion confirmation for {subject} {row.inum}
        </ModalHeader>
        <ModalBody>Do you really want to delete this item?</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onAccept}>
            Yes
          </Button>{' '}
          <Button color="secondary" onClick={handler}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default GluuDialog
