import React, { useState, useEffect, useRef, useContext } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import GluuSingleValueCompleter from '../../../../app/routes/Apps/Gluu/GluuSingleValueCompleter'
import GluuTypeAhead from '../../../../app/routes/Apps/Gluu/GluuTypeAhead'
import { useSelector } from 'react-redux'
import { ThemeContext } from 'Context/theme/themeContext'

const DOC_CATEGORY = 'openid_client'

interface Role {
  role: string
  permissions?: string[]
}

interface MappingItem {
  role: string
  permissions: string[]
}

interface Permission {
  permission: string
}

interface RootState {
  apiPermissionReducer: {
    items: Permission[]
  }
}

interface MappingAddDialogFormProps {
  handler: () => void
  modal: boolean
  onAccept: (roleData: { role: string; permissions: string[] }) => void
  roles: Role[]
  mapping?: MappingItem[]
}

const MappingAddDialogForm: React.FC<MappingAddDialogFormProps> = ({
  handler,
  modal,
  onAccept,
  roles,
  mapping = [],
}) => {
  const [active, setActive] = useState<boolean>(false)
  const [autoCompleteRoles, setAutoCompleteRoles] = useState<string[]>([])
  const [searchablePermissions, setSearchAblePermissions] = useState<string[]>([])
  const [apiRole, setApiRole] = useState<string>('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const autocompleteRef = useRef<any>(null)
  const { t } = useTranslation()
  const permissions = useSelector((state: RootState) => state.apiPermissionReducer.items)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme

  const getPermissionsForSearch = (): void => {
    const filteredArr: string[] = []
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
    const rolesArr: string[] = []
    for (const role of roles) {
      const isRoleInMapping = mapping.some(mappingItem => mappingItem.role === role.role)
      if (!isRoleInMapping) {
        rolesArr.push(role.role)
      }
    }
    setAutoCompleteRoles(rolesArr)
  }, [roles, mapping])

  function handleAccept(): void {
    const roleData: { role: string; permissions: string[] } = {
      role: apiRole,
      permissions: selectedPermissions,
    }
    onAccept(roleData)
  }
  return (
    <>
      <Modal isOpen={modal} toggle={handler} className="modal-outline-primary modal-lg">
        <ModalHeader toggle={handler}>
          <i style={{ color: 'green' }} className="fa fa-2x fa-info fa-fw modal-icon mb-3"></i>
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
            onChange={(selected: string[]) => setApiRole(selected.length ? selected[0] : '')}
            doc_category={DOC_CATEGORY}
          />
          <GluuTypeAhead
            name="addMappingRolePermissions"
            label="Permissions"
            onChange={(selected: string[]) => {
              setSelectedPermissions(selected)
            }}
            options={searchablePermissions}
            required={false}
            value={[]}
            forwardRef={autocompleteRef}
            doc_category={'Mapping'}
          />
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
