import React, { useState, useContext } from 'react'
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

const PermissionAddDialogForm = ({ handler, modal, onAccept }) => {
  const [permission, setPermission] = useState('')
  const [description, setDescription] = useState('')
  const [defaultPermissionInToken, setDefaultPermissionInToken] = useState()
  const [tag, setTag] = useState('')
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const [errorMessages, setErrorMessages] = useState('')
  const selectedTheme = theme.state.theme

  function handleAccept() {
    if (permission?.length < 5) {
      setErrorMessages(t('messages.permission_name_error'))
      return
    }

    const roleData = {
      permission,
      tag,
      description,
      ...(defaultPermissionInToken !== undefined &&
        defaultPermissionInToken !== '' && {
          defaultPermissionInToken: defaultPermissionInToken === 'true',
        }),
    }

    onAccept(roleData)
    setErrorMessages('')
  }

  return (
    <>
      <Modal
        style={{ minWidth: '50vw' }}
        isOpen={modal}
        toggle={handler}
        className="modal-outline-primary"
      >
        <ModalHeader toggle={handler}>
          <i style={{ color: 'green' }} className="fa fa-2x fa-info fa-fw modal-icon mb-3"></i>
          New Permission
        </ModalHeader>
        <ModalBody>Adding new api permission</ModalBody>
        <ModalBody>
          <FormGroup row>
            <GluuLabel required label="fields.name" size={4} />
            <Col sm={8}>
              <Input
                id="api_permission"
                type="text"
                name="api_permission"
                onChange={(event) => setPermission(event.target.value)}
                value={permission}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="fields.tag" size={4} />
            <Col sm={8}>
              <Input
                id="tag"
                type="text"
                name="tag"
                onChange={(event) => setTag(event.target.value)}
                value={tag}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="fields.description" size={4} />
            <Col sm={8}>
              <Input
                id="permission_description"
                type="textarea"
                name="permission_description"
                onChange={(event) => setDescription(event.target.value)}
                value={description}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label="fields.default_permission_in_token" size={4} />
            <Col sm={8}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="defaultPermissionInToken"
                  name="defaultPermissionInToken"
                  value={defaultPermissionInToken}
                  onChange={(event) => setDefaultPermissionInToken(event.target.value)}
                  disabled={false}
                >
                  <option value="">{t('actions.choose')}...</option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </CustomInput>
              </InputGroup>
            </Col>
          </FormGroup>

          {errorMessages ? <span style={{ color: '#e74c3c' }}>{errorMessages}</span> : null}
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
