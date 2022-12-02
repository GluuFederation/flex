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
import { connect, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import useAlert from 'Context/alert/useAlert'

const RoleAddDialogForm = ({ handler, modal, onAccept }) => {
  const {isError, isSuccess} = useSelector(state => state.apiRoleReducer)
  const [active, setActive] = useState(false)
  const [deletable, setDeletable] = useState(false)
  
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const { setAlert } = useAlert()

  const selectedTheme = theme.state.theme
  const alertSeverity = isSuccess ? 'success' : 'error'
  const alertMessage = isSuccess ? t('messages.success_in_saving') : t('messages.error_in_saving')

  function handleStatus() {
    const value = document.getElementById('api_role').value
    if (value.length >= 5) {
      setActive(true)
    } else {
      setActive(false)
    }
  }

  function handleAccept() {
    const roleData = {}
    roleData['role'] = document.getElementById('api_role').value
    roleData['description'] = document.getElementById('api_description').value
    roleData['deletable'] = deletable
    onAccept(roleData)
  }

  useEffect(() => {
    const alertParam = { 
      open: (isSuccess || isError),
      title: isSuccess ? 'Success' : 'Failed',
      text: alertMessage,
      severity: alertSeverity
    }
    setAlert(alertParam)
  }, [isSuccess, isError])

  return (
    <>
      <Modal isOpen={modal} toggle={handler}>
        <ModalHeader toggle={handler}>
          <i
            style={{ color: 'green' }}
            className="fa fa-2x fa-info fa-fw modal-icon mb-3"
          ></i>
          New Role
        </ModalHeader>
        <ModalBody>Adding new api config role</ModalBody>
        <ModalBody>
          <FormGroup row>
            <Col sm={12}>
              <Input
                id="api_role"
                type="text"
                name="api_role"
                onKeyUp={handleStatus}
                defaultValue=""
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={12}>
              <Input
                id="api_description"
                type="textarea"
                name="api_description"
                defaultValue=""
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={12} className="pl-4">
              <Input
                id="deletable"
                type="checkbox"
                name="deletable"
                onChange={(e) => {
                  setDeletable(e.target.checked)
                }}
                checked={deletable}
              />{' '}
              Deletable ?
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

export default RoleAddDialogForm
