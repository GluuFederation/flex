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

  const printableScopes = scopesByCreator.filter(
    (item) => item.scopeType == 'spontaneous',
  )
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  return (
    <Modal isOpen={isOpen} toggle={handler} className="modal-outline-primary">
      <ModalHeader>{t('fields.spontaneousScopes')}</ModalHeader>
      <ModalBody>
        {printableScopes.length > 0 ? (
          printableScopes?.map((scope, key) => {
            return (
              <div key={key}>
                <Badge color={`primary-${selectedTheme}`}>{scope?.id}</Badge>
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
