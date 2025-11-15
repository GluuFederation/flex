import React from 'react'
import GluuRemovableInputRow from 'Routes/Apps/Gluu/GluuRemovableInputRow'
import GluuRemovableSelectRow from 'Routes/Apps/Gluu/GluuRemovableSelectRow'
import GluuRemovableTypeAhead from 'Routes/Apps/Gluu/GluuRemovableTypeAhead'
import { countries } from 'Plugins/user-management/common/countries'
import { JANS_ADMIN_UI_ROLE_ATTR, COUNTRY_ATTR } from '../common/Constants'
import { useGetAllAdminuiRoles } from 'JansConfigApi'
import { UserClaimEntryProps } from '../types/ComponentTypes'

function UserClaimEntry({
  data,
  entry,
  formik,
  handler,
  modifiedFields,
  setModifiedFields,
}: UserClaimEntryProps) {
  const doHandle = (): void => {
    handler(data.name)
  }

  const { data: rolesData, isLoading: rolesLoading, isError: rolesError } = useGetAllAdminuiRoles()
  const rolesToBeShown: string[] = (rolesData ?? [])
    .map((roleItem) => roleItem.role)
    .filter((role): role is string => Boolean(role))

  const isRoleField = data.name === JANS_ADMIN_UI_ROLE_ATTR
  const isRolesUnavailable = isRoleField && (rolesLoading || rolesError)

  return (
    <div key={entry}>
      {data.oxMultiValuedAttribute && (
        <GluuRemovableTypeAhead
          label={data.displayName}
          name={data.name}
          allowNew={data.name !== JANS_ADMIN_UI_ROLE_ATTR}
          value={formik.values[data.name] || []}
          formik={formik}
          isDirect={true}
          options={isRoleField ? rolesToBeShown : formik.values[data.name] || []}
          handler={doHandle}
          modifiedFields={modifiedFields}
          setModifiedFields={setModifiedFields}
          doc_category={data.description}
          lsize={3}
          rsize={9}
          disabled={isRolesUnavailable}
          placeholder={
            isRolesUnavailable
              ? rolesLoading
                ? 'Loading roles...'
                : 'Failed to load roles'
              : undefined
          }
        />
      )}
      {data.name !== COUNTRY_ATTR && !data.oxMultiValuedAttribute && (
        <GluuRemovableInputRow
          label={data.displayName}
          name={data.name}
          isDirect={true}
          value={formik.values[data.name] || ''}
          formik={formik}
          handler={doHandle}
          modifiedFields={modifiedFields}
          setModifiedFields={setModifiedFields}
          doc_category={data.description}
          lsize={3}
          rsize={9}
          isBoolean={data?.dataType?.toLowerCase() === 'boolean'}
        />
      )}
      {data.name === COUNTRY_ATTR && !data.oxMultiValuedAttribute && (
        <GluuRemovableSelectRow
          label={data.displayName}
          name={data.name}
          doc_category={data.description}
          isDirect={true}
          value={formik.values[data.name] || ''}
          values={countries}
          formik={formik}
          modifiedFields={modifiedFields}
          setModifiedFields={setModifiedFields}
          required
          handler={doHandle}
          lsize={3}
          rsize={9}
        />
      )}
    </div>
  )
}
export default UserClaimEntry
