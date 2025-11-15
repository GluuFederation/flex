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

  const { data: rolesData } = useGetAllAdminuiRoles()
  const rolesToBeShown: string[] = (rolesData ?? [])
    .map((roleItem) => roleItem.role)
    .filter((role): role is string => Boolean(role))

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
          options={
            data.name === JANS_ADMIN_UI_ROLE_ATTR ? rolesToBeShown : formik.values[data.name] || []
          }
          handler={doHandle}
          modifiedFields={modifiedFields}
          setModifiedFields={setModifiedFields}
          doc_category={data.description}
          lsize={3}
          rsize={9}
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
