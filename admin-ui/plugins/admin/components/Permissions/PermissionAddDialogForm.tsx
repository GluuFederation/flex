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
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { InputGroup, CustomInput } from 'Components'

interface PermissionData {
  permission: string
  tag: string
  description: string
  defaultPermissionInToken?: boolean
}

interface PermissionAddDialogFormProps {
  handler: () => void
  modal: boolean
  onAccept: (data: PermissionData) => void
}

const PermissionAddDialogForm: React.FC<PermissionAddDialogFormProps> = ({ 
  handler, 
  modal, 
  onAccept 
}) => {
  const [permission, setPermission] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [defaultPermissionInToken, setDefaultPermissionInToken] = useState<string>('')
  const [tag, setTag] = useState<string>('')
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const [errorMessages, setErrorMessages] = useState<string>('')
  const selectedTheme = theme?.state.theme

  function handleAccept(): void {
    if (permission?.length < 5) {
      setErrorMessages(t('messages.permission_name_error'))
      return
    }

    const roleData: PermissionData = {
      permission,
      tag,
      description,
      ...(defaultPermissionInToken !== undefined &&
        defaultPermissionInToken !== '' && {
        defaultPermissionInToken:
          defaultPermissionInToken === 'true',
      }),
    }

    onAccept(roleData)
    setErrorMessages('')
  }

  const handlePermissionChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPermission(event.target.value)
  }

  const handleTagChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTag(event.target.value)
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDescription(event.target.value)
  }

  const handleDefaultPermissionChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setDefaultPermissionInToken(event.target.value)
  }

  return (
    <>
      <Modal
        style={{ minWidth: '50vw' }}
        isOpen={modal}
        toggle={handler}
        className='modal-outline-primary'
      >
        <ModalHeader toggle={handler}>
          <i
            style={{ color: 'green' }}
            className='fa fa-2x fa-info fa-fw modal-icon mb-3'
          ></i>
          New Permission
        </ModalHeader>
        <ModalBody>Adding new api permission</ModalBody>
        <ModalBody>
          <FormGroup row>
            <GluuLabel required label='fields.name' size={4} />
            <Col sm={8}>
              <Input
                id='api_permission'
                type='text'
                name='api_permission'
                onChange={handlePermissionChange}
                value={permission}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label='fields.tag' size={4} />
            <Col sm={8}>
              <Input
                id='tag'
                type='text'
                name='tag'
                onChange={handleTagChange}
                value={tag}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label='fields.description' size={4} />
            <Col sm={8}>
              <Input
                id='permission_description'
                type='textarea'
                name='permission_description'
                onChange={handleDescriptionChange}
                value={description}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label='fields.default_permission_in_token' size={4} />
            <Col sm={8}>
              <InputGroup>
                <CustomInput
                  type='select'
                  id='defaultPermissionInToken'
                  name='defaultPermissionInToken'
                  value={defaultPermissionInToken}
                  onChange={handleDefaultPermissionChange}
                  disabled={false}
                >
                  <option value=''>{t('actions.choose')}...</option>
                  <option value='true'>true</option>
                  <option value='false'>false</option>
                </CustomInput>
              </InputGroup>
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

export default PermissionAddDialogForm
