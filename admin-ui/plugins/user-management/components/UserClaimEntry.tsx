import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import GluuRemovableInputRow from 'Routes/Apps/Gluu/GluuRemovableInputRow'
import GluuRemovableSelectRow from 'Routes/Apps/Gluu/GluuRemovableSelectRow'
import GluuAutocomplete from 'Routes/Apps/Gluu/GluuAutocomplete'
import { countries } from 'Plugins/user-management/common/countries'
import { JANS_ADMIN_UI_ROLE_ATTR, COUNTRY_ATTR } from '../common'
import { getClaimLabel, getClaimLabelKey } from '../utils/claimLabelUtils'
import { useGetAllAdminuiRoles } from 'JansConfigApi'
import { UserClaimEntryProps } from '../types'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
const UserClaimEntry = ({
  data,
  entry,
  formik,
  handler,
  modifiedFields,
  setModifiedFields,
}: UserClaimEntryProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(
    () => getThemeColor(themeState?.theme ?? DEFAULT_THEME),
    [themeState?.theme],
  )

  const claimLabelKey = useMemo(
    () => getClaimLabelKey(t, data.name, data.displayName),
    [t, data.name, data.displayName],
  )

  const claimLabel = useMemo(
    () => getClaimLabel(t, data.name, data.displayName),
    [t, data.name, data.displayName],
  )

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
  const userManagementMultiSelectBg =
    themeColors.settings?.formInputBackground ?? themeColors.inputBackground

  const multiValue = Array.isArray(formik.values[data.name])
    ? (formik.values[data.name] as string[]).filter((v): v is string => typeof v === 'string')
    : []
  const multiValueOptions = isRoleField ? rolesToBeShown : [...multiValue]

  const handleMultiValueChange = useCallback(
    (next: string[]) => {
      formik.setFieldValue(data.name, next)
      formik.setFieldTouched(data.name, true, false)
      const initial = formik.initialValues[data.name]
      const initialArr = Array.isArray(initial)
        ? (initial as string[]).filter((v): v is string => typeof v === 'string')
        : []
      const isSameAsInitial =
        next.length === initialArr.length && next.every((v, i) => v === initialArr[i])
      setModifiedFields((prev) => {
        if (isSameAsInitial) {
          const rest = { ...prev }
          delete rest[data.name]
          return rest
        }
        return { ...prev, [data.name]: next }
      })
    },
    [data.name, formik, setModifiedFields],
  )

  if (data.oxMultiValuedAttribute) {
    return (
      <div key={entry}>
        <GluuAutocomplete
          label={claimLabel}
          name={data.name}
          value={multiValue}
          options={multiValueOptions}
          onChange={handleMultiValueChange}
          disabled={isRolesUnavailable}
          placeholder={
            isRolesUnavailable
              ? rolesLoading
                ? t('messages.loading_roles')
                : t('messages.failed_load_roles')
              : t('placeholders.search_here')
          }
          inputBackgroundColor={userManagementMultiSelectBg}
          allowCustom={data.name !== JANS_ADMIN_UI_ROLE_ATTR}
          doc_category={data.description}
          onRemoveField={doHandle}
        />
      </div>
    )
  }

  if (data.name === COUNTRY_ATTR) {
    return (
      <div key={entry}>
        <GluuRemovableSelectRow
          label={claimLabelKey}
          name={data.name}
          doc_category={typeof data.description === 'string' ? data.description : undefined}
          isDirect={true}
          value={String(formik.values[data.name] ?? '')}
          values={countries}
          formik={formik as React.ComponentProps<typeof GluuRemovableSelectRow>['formik']}
          modifiedFields={modifiedFields}
          setModifiedFields={setModifiedFields}
          handler={doHandle}
          lsize={12}
        />
      </div>
    )
  }

  return (
    <div key={entry}>
      <GluuRemovableInputRow
        label={claimLabelKey}
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
        lsize={12}
        isBoolean={data?.dataType?.toLowerCase() === 'boolean'}
      />
    </div>
  )
}
export default React.memo(UserClaimEntry)
