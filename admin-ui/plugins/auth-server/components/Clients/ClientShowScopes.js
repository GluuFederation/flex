import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Badge } from 'Components'
import { useSelector } from 'react-redux'

function ClientShowScopes({ handler, data, isOpen }) {
  const scopes = useSelector((state) => state.scopeReducer.items)
  const clientScopes = scopes
    .filter((item) => data.includes(item.dn, 0))
    .map((item) => item.id)
  return (
    <Modal isOpen={isOpen} toggle={handler} className="modal-outline-primary">
      <ModalHeader>Scopes</ModalHeader>
      <ModalBody>
        {clientScopes.map((scope, key) => {
          return (
            <div key={key}>
              <Badge color="primary">
                {scope}
              </Badge>
            </div>
          )
        })}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handler}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}
export default ClientShowScopes
