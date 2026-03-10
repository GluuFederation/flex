import React, { useCallback, useMemo } from 'react'
import GluuRemovableInputRow from 'Routes/Apps/Gluu/GluuRemovableInputRow'
import GluuRemovableSelectRow from 'Routes/Apps/Gluu/GluuRemovableSelectRow'
import MultiValueSelectCard from 'Routes/Apps/Gluu/MultiValueSelectCard'
import { countries } from 'Plugins/user-management/common/countries'
import { JANS_ADMIN_UI_ROLE_ATTR, COUNTRY_ATTR } from '../common/Constants'
import { useGetAllAdminuiRoles } from 'JansConfigApi'
import { UserClaimEntryProps } from '../types/ComponentTypes'

const UserClaimEntry = ({
  data,
  entry,
  formik,
  handler,
  modifiedFields,
  setModifiedFields,
}: UserClaimEntryProps) => {
  const doHandle = useCallback(() => {
    handler(data.name)
  }, [handler, data.name])

  const { data: rolesData, isLoading: rolesLoading, isError: rolesError } = useGetAllAdminuiRoles()
  const rolesToBeShown = useMemo(
    () =>
      (rolesData ?? [])
        .map((roleItem) => roleItem.role)
        .filter((role): role is string => Boolean(role)),
    [rolesData],
  )

  const isRoleField = data.name === JANS_ADMIN_UI_ROLE_ATTR
  const isRolesUnavailable = isRoleField && (rolesLoading || rolesError)

  const multiValue = Array.isArray(formik.values[data.name])
    ? (formik.values[data.name] as string[]).filter((v): v is string => typeof v === 'string')
    : []
  const multiValueOptions = isRoleField ? rolesToBeShown : [...multiValue]

  const handleMultiValueChange = useCallback(
    (next: string[]) => {
      formik.setFieldValue(data.name, next)
      formik.setFieldTouched(data.name, true, false)
      setModifiedFields({ ...modifiedFields, [data.name]: next })
    },
    [data.name, formik, modifiedFields, setModifiedFields],
  )

  return (
    <div key={entry}>
      {data.oxMultiValuedAttribute && (
        <MultiValueSelectCard
          label={data.displayName || data.name}
          name={data.name}
          value={multiValue}
          options={multiValueOptions}
          onChange={handleMultiValueChange}
          disabled={isRolesUnavailable}
          placeholder={
            isRolesUnavailable
              ? rolesLoading
                ? 'Loading roles...'
                : 'Failed to load roles'
              : 'Search Here'
          }
          allowCustom={!isRoleField}
          onRemoveField={doHandle}
          doc_category={data.description}
        />
      )}
      {data.name !== COUNTRY_ATTR && !data.oxMultiValuedAttribute && (
        <GluuRemovableInputRow
          label={data.displayName || ''}
          name={data.name}
          isDirect={true}
          value={
            data?.dataType?.toLowerCase() === 'boolean'
              ? Boolean(formik.values[data.name])
              : String(formik.values[data.name] ?? '')
          }
          formik={formik}
          handler={doHandle}
          modifiedFields={modifiedFields}
          setModifiedFields={setModifiedFields}
          doc_category={typeof data.description === 'string' ? data.description : undefined}
          lsize={3}
          rsize={9}
          isBoolean={data?.dataType?.toLowerCase() === 'boolean'}
        />
      )}
      {data.name === COUNTRY_ATTR && !data.oxMultiValuedAttribute && (
        <GluuRemovableSelectRow
          label={data.displayName || ''}
          name={data.name}
          doc_category={typeof data.description === 'string' ? data.description : undefined}
          isDirect={true}
          value={String(formik.values[data.name] ?? '')}
          values={countries}
          formik={formik as React.ComponentProps<typeof GluuRemovableSelectRow>['formik']}
          modifiedFields={modifiedFields}
          setModifiedFields={setModifiedFields}
          handler={doHandle}
          lsize={3}
          rsize={9}
        />
      )}
    </div>
  )
}
export default React.memo(UserClaimEntry)
