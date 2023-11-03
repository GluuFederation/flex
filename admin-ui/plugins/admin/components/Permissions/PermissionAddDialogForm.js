import React, { useState, useContext, useEffect } from 'react'
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

const PermissionAddDialogForm = ({ handler, modal, onAccept }) => {
  const [active, setActive] = useState(false)
  const [permission, setPermission] = useState('') 
  const [description, setDescription] = useState('')
  const [tag, setTag] = useState('')
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (permission?.length >= 5 && tag.length > 0) {
        setActive(true)
      } else {
        setActive(false)
      }
    }
  }, [tag, permission])

  function handleAccept() {
    const roleData = {}
    roleData['permission'] = permission
    roleData['tag'] = tag
    roleData['description'] = description
    onAccept(roleData)
  }
  return (
    <>
      <Modal isOpen={modal} toggle={handler} className="modal-outline-primary">
        <ModalHeader toggle={handler}>
          <i
            style={{ color: 'green' }}
            className="fa fa-2x fa-info fa-fw modal-icon mb-3"
          ></i>
          New Permission
        </ModalHeader>
        <ModalBody>Adding new api permission</ModalBody>
        <ModalBody>
          <FormGroup row>
            <Col sm={12}>
              <Input
                id="api_permission"
                type="text"
                name="api_permission"
                defaultValue=""
                placeholder={`${t('fields.name')}*`}
                onChange={(event) => setPermission(event.target.value)}
                value={permission}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={12}>
              <Input
                id="tag"
                type="text"
                name="tag"
                defaultValue=""
                placeholder={`${t('fields.tag')}*`}
                onChange={(event) => setTag(event.target.value)}
                value={tag}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={12}>
              <Input
                id="permission_description"
                type="textarea"
                name="permission_description"
                defaultValue=""
                placeholder={`${t('fields.description')}`}
                onChange={(event) => setDescription(event.target.value)}
                value={description}
              />
            </Col>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {active && (
            <Button
              color={`primary-${selectedTheme}`}
              style={applicationStyle.buttonStyle}
              onClick={handleAccept}
            >
              {t('actions.yes')}
            </Button>
          )}{' '}
          <Button
            color={`primary-${selectedTheme}`}
            style={applicationStyle.buttonStyle}
            onClick={handler}
          >
            {t('actions.no')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default PermissionAddDialogForm
