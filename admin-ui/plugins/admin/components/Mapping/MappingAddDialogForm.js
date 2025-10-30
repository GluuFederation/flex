import React, { useState, useEffect, useRef, useContext } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import GluuSingleValueCompleter from '../../../../app/routes/Apps/Gluu/GluuSingleValueCompleter'
import GluuTypeAhead from '../../../../app/routes/Apps/Gluu/GluuTypeAhead'
import { useSelector } from 'react-redux'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'

const DOC_CATEGORY = 'openid_client'

const MappingAddDialogForm = ({ handler, modal, onAccept, roles, mapping = [] }) => {
  const [active, setActive] = useState(false)
  const [autoCompleteRoles, setAutoCompleteRoles] = useState([])
  const [searchablePermissions, setSearchAblePermissions] = useState([])
  const [apiRole, setApiRole] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const autocompleteRef = useRef(null)
  const { t } = useTranslation()
  const permissions = useSelector((state) => state.apiPermissionReducer.items)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  useEffect(() => {
    if (!modal) {
      setApiRole('')
      setSelectedPermissions([])
      setActive(false)
    }
  }, [modal])

  const getPermissionsForSearch = (role = '') => {
    const fullPermissions = []
    for (const i in permissions) {
      if (permissions[i]?.permission) {
        fullPermissions.push(permissions[i].permission)
      }
    }
    if (role) {
      const roleMapping = (mapping || []).find((m) => m?.role === role)
      const assigned = new Set(roleMapping?.permissions || [])
      const filtered = fullPermissions.filter((p) => !assigned.has(p))
      setSearchAblePermissions(filtered)
      return
    }
    setSearchAblePermissions(fullPermissions)
  }
  useEffect(() => {
    getPermissionsForSearch(apiRole)
  }, [permissions])

  useEffect(() => {
    if (selectedPermissions.length && apiRole != '') {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [apiRole, selectedPermissions])

  useEffect(() => {
    getPermissionsForSearch(apiRole)
  }, [apiRole, mapping])

  useEffect(() => {
    const rolesArr = []
    for (const i in roles) {
      if (roles[i]?.role) {
        rolesArr.push(roles[i].role)
      }
    }
    setAutoCompleteRoles(rolesArr)
  }, [roles])

  function handleAccept() {
    const roleData = {}
    roleData['role'] = apiRole
    roleData['permissions'] = selectedPermissions
    onAccept(roleData)
  }
  return (
    <>
      <Modal isOpen={modal} toggle={handler} className="modal-outline-primary modal-lg">
        <ModalHeader toggle={handler}>
          <i
            style={{ color: customColors.logo }}
            className="fa fa-2x fa-info fa-fw modal-icon mb-3"
          ></i>
          {t('messages.new_role')}
        </ModalHeader>
        <ModalBody>{t('messages.adding_new_permission')}</ModalBody>
        <ModalBody>
          <GluuSingleValueCompleter
            name="api_role"
            label="fields.role"
            options={autoCompleteRoles}
            value={[]}
            hideHelperMessage
            onChange={(selected) => setApiRole(selected.length ? selected[0] : '')}
            doc_category={DOC_CATEGORY}
          ></GluuSingleValueCompleter>
          <GluuTypeAhead
            name="addMappingRolePermissions"
            label="Permissions"
            onChange={(selected) => {
              setSelectedPermissions(selected)
            }}
            options={searchablePermissions}
            allowNew={false}
            value={selectedPermissions}
            required={false}
            forwardRef={autocompleteRef}
            doc_category={'Mapping'}
          ></GluuTypeAhead>
        </ModalBody>
        <ModalFooter>
          {active && (
            <Button
              color={`primary-${selectedTheme}`}
              style={applicationStyle.buttonStyle}
              onClick={handleAccept}
            >
              <i className="fa fa-plus me-2"></i>
              {t('actions.add')}
            </Button>
          )}{' '}
          <Button
            color={`primary-${selectedTheme}`}
            style={applicationStyle.buttonStyle}
            onClick={handler}
          >
            {t('actions.cancel')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default MappingAddDialogForm
