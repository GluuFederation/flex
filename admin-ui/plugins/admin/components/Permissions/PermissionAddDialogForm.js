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
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'

const PermissionAddDialogForm = ({ handler, modal, onAccept }) => {
  const [active, setActive] = useState(false)
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  function handleStatus() {
    const value = document.getElementById('api_permission').value
    if (value.length >= 5) {
      setActive(true)
    } else {
      setActive(false)
    }
  }

  function handleAccept() {
    const roleData = {}
    roleData['permission'] = document.getElementById('api_permission').value
    roleData['description'] = document.getElementById(
      'permission_description',
    ).value
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
                onKeyUp={handleStatus}
                defaultValue=""
                placeholder={`${t('fields.name')}`}
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
