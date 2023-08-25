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
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'

const RoleAddDialogForm = ({ handler, modal, onAccept }) => {
  const [active, setActive] = useState(false)
  const [deletable, setDeletable] = useState(false)
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

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
        <ModalBody>{t('messages.adding_new_api_config_role')}</ModalBody>
        <ModalBody>
          <FormGroup row>
            <Col sm={12}>
              <Input
                id='api_role'
                type='text'
                name='api_role'
                onKeyUp={handleStatus}
                defaultValue=''
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={12}>
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
                handler={(e) => {
                  setDeletable(e.target.checked)
                }}
                lsize={4}
                rsize={8}
                label={`${t('documentation.no_category.deletable')} ?`}
                value={deletable}
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

export default RoleAddDialogForm
