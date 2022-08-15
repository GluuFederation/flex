import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Badge } from 'Components'
import { useSelector } from 'react-redux'
import { ThemeContext } from 'Context/theme/themeContext'

function ClientShowSpontaneousScopes({ handler, isOpen }) {
  const { t } = useTranslation()
  const scopesByCreator = useSelector(
    (state) => state.scopeReducer.scopesByCreator,
  )
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  return (
    <Modal isOpen={isOpen} toggle={handler} className="modal-outline-primary">
      <ModalHeader>{t('fields.spontaneousScopes')}</ModalHeader>
      <ModalBody>
        {scopesByCreator.length > 0 ? (
          scopesByCreator?.map((scope, key) => {
            return (
              <div key={key}>
                <Badge color={`primary-${selectedTheme}`}>
                  {scope?.attributes?.spontaneousClientScopes[0]}
                </Badge>
              </div>
            )
          })
        ) : (
          <div>{t('messages.no_scope_in_spontaneous_client')}</div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color={`primary-${selectedTheme}`} onClick={handler}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}
export default ClientShowSpontaneousScopes
