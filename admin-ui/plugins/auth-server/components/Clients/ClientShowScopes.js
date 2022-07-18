import React, { useContext } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Badge } from 'Components'
import { useSelector } from 'react-redux'
import { ThemeContext } from 'Context/theme/themeContext'

function ClientShowScopes({ handler, data, isOpen }) {
  const scopes = useSelector((state) => state.scopeReducer.items)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
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
              <Badge color={`primary-${selectedTheme}`}>
                {scope}
              </Badge>
            </div>
          )
        })}
      </ModalBody>
      <ModalFooter>
        <Button color={`primary-${selectedTheme}`} onClick={handler}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}
export default ClientShowScopes
