import React, { useState, useEffect, useRef, useContext } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import GluuSingleValueCompleter from '../../../../app/routes/Apps/Gluu/GluuSingleValueCompleter'
import GluuTypeAhead from '../../../../app/routes/Apps/Gluu/GluuTypeAhead'
import { useSelector } from 'react-redux'
import { ThemeContext } from 'Context/theme/themeContext'

const DOC_CATEGORY = 'openid_client'

const MappingAddDialogForm = ({
  handler,
  modal,
  onAccept,
  roles,
  mapping = [],
}) => {
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

  const getPermissionsForSearch = () => {
    const filteredArr = []
    for (const i in permissions) {
      filteredArr.push(permissions[i].permission)
    }
    setSearchAblePermissions(filteredArr)
  }
  useEffect(() => {
    getPermissionsForSearch()
  }, [permissions])

  useEffect(() => {
    if (selectedPermissions.length && apiRole != '') {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [apiRole, selectedPermissions])

  useEffect(() => {
    const addedRoles = []
    for (const i in mapping) {
      addedRoles.push(mapping[i].role)
    }

    const rolesArr = []
    for (const i in roles) {
      if (!addedRoles.includes(roles[i].role)) {
        rolesArr.push(roles[i].role)
      }
    }
    setAutoCompleteRoles(rolesArr)
  }, [roles, mapping])

  function handleAccept() {
    const roleData = {}
    roleData['role'] = apiRole
    roleData['permissions'] = selectedPermissions
    onAccept(roleData)
  }
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={handler}
        className="modal-outline-primary modal-lg"
      >
        <ModalHeader toggle={handler}>
          <i
            style={{ color: 'green' }}
            className="fa fa-2x fa-info fa-fw modal-icon mb-3"
          ></i>
          New Role
        </ModalHeader>
        <ModalBody>Adding new api config role</ModalBody>
        <ModalBody>
          <GluuSingleValueCompleter
            name="api_role"
            label="fields.role"
            options={autoCompleteRoles}
            value={[]}
            onChange={(selected) =>
              setApiRole(selected.length ? selected[0] : '')
            }
            doc_category={DOC_CATEGORY}
          ></GluuSingleValueCompleter>
          <GluuTypeAhead
            name="addMappingRolePermissions"
            label="Permissions"
            onChange={(selected) => {
              setSelectedPermissions(selected)
            }}
            options={searchablePermissions}
            required={false}
            value={[]}
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

export default MappingAddDialogForm
