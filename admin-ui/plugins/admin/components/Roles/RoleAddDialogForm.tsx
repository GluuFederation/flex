import React, { useState, useContext, ChangeEvent } from 'react'
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
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'

interface RoleData {
  role: string
  description: string
  deletable: boolean
}

interface RoleAddDialogFormProps {
  handler: () => void
  modal: boolean
  onAccept: (roleData: RoleData) => void
}

const RoleAddDialogForm: React.FC<RoleAddDialogFormProps> = ({ handler, modal, onAccept }) => {
  const [deletable, setDeletable] = useState<boolean>(false)
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || 'light'
  const [errorMessages, setErrorMessages] = useState<string>('')

  function handleAccept(): void {
    const roleData: RoleData = {
      role: (document.getElementById('api_role') as HTMLInputElement)?.value || '',
      description: (document.getElementById('api_description') as HTMLInputElement)?.value || '',
      deletable: deletable
    }
    
    if (roleData.role.length < 5) {
      setErrorMessages(t('messages.role_name_error'))
      return
    }

    onAccept(roleData)
  }
  
  return (
    <>
      <Modal isOpen={modal} toggle={handler}>
        <ModalHeader toggle={handler}>
          <i
            style={{ color: 'green' }}
            className='fa fa-2x fa-info fa-fw modal-icon mb-3'
          ></i>
          {t('messages.new_role')}
        </ModalHeader>
        <ModalBody>{t('messages.adding_new_permission')}</ModalBody>
        <ModalBody>
          <FormGroup row>
            <GluuLabel label={'fields.name'} />
            <Col sm={9}>
              <Input
                id='api_role'
                type='text'
                name='api_role'
                defaultValue=''
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={'fields.description'} />
            <Col sm={9}>
              <Input
                id='api_description'
                type='textarea'
                name='api_description'
                defaultValue=''
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={12} className='ps-4'>
              <GluuToogleRow
                name='deletable'
                handler={(e: ChangeEvent<HTMLInputElement>) => {
                  setDeletable(e.target.checked)
                }}
                lsize={4}
                rsize={8}
                label={`${t('documentation.no_category.deletable')}`}
                value={deletable}
              />
            </Col>
          </FormGroup>

          {errorMessages ? (
            <span style={{ color: '#e74c3c' }}>{errorMessages}</span>
          ) : null}

        </ModalBody>
        <ModalFooter>
          <Button
            color={`primary-${selectedTheme}`}
            style={applicationStyle.buttonStyle}
            onClick={handleAccept}
          >
            {t('actions.save')}
          </Button>
          <Button onClick={handler}>{t('actions.cancel')}</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default RoleAddDialogForm
