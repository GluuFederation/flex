import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import GluuAutocomplete from 'Routes/Apps/Gluu/GluuAutocomplete'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useStyles } from './styles/ClientScriptPanel.style'
import type { ClientScriptPanelProps, ClientScriptField } from './types'

const DOC_CATEGORY = 'openid_client'

const CLIENT_SCRIPT_FIELDS: ClientScriptField[] = [
  {
    name: 'attributes.spontaneousScopeScriptDns',
    labelKey: 'fields.spontaneous_scopes',
    scriptType: 'spontaneous_scope',
    modifiedField: 'Spontaneous Scope Script Dns',
  },
  {
    name: 'attributes.updateTokenScriptDns',
    labelKey: 'fields.updateTokenScriptDns',
    scriptType: 'update_token',
    modifiedField: 'Update Token Script Dns',
  },
  {
    name: 'attributes.postAuthnScripts',
    labelKey: 'fields.post_authn_scripts',
    scriptType: 'post_authn',
    modifiedField: 'Post Authn Script',
  },
  {
    name: 'attributes.introspectionScripts',
    labelKey: 'fields.introspection_scripts',
    scriptType: 'introspection',
    modifiedField: 'Introspection Scripts',
  },
  {
    name: 'attributes.ropcScripts',
    labelKey: 'fields.ropcScripts',
    scriptType: 'resource_owner_password_credentials',
    modifiedField: 'ROPC Scripts',
  },
  {
    name: 'attributes.consentGatheringScripts',
    labelKey: 'fields.consent_gathering_scripts',
    scriptType: 'consent_gathering',
    modifiedField: 'Consent Gathering Scripts',
  },
]

function ClientScriptPanel({
  scripts,
  formik,
  viewOnly,
  modifiedFields: _modifiedFields,
  setModifiedFields,
}: ClientScriptPanelProps) {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ themeColors })

  const scriptOptionsByType = useMemo(
    () =>
      CLIENT_SCRIPT_FIELDS.reduce<Record<string, { dn: string; name: string }[]>>((acc, field) => {
        acc[field.name] = scripts
          .filter((item) => item.scriptType === field.scriptType)
          .filter((item) => item.enabled)
          .map((item) => ({
            dn: item.dn != null ? String(item.dn) : '',
            name: item.name != null ? String(item.name) : '',
          }))
        return acc
      }, {}),
    [scripts],
  )

  const getSelectedScriptNames = useCallback(
    (fieldName: string): string[] => {
      const key = fieldName.split('.').pop() ?? ''
      const rawValue = formik.values.attributes?.[key]
      const selectedDns = Array.isArray(rawValue)
        ? rawValue.filter((v): v is string => typeof v === 'string')
        : []
      const options = scriptOptionsByType[fieldName] ?? []
      return options.filter((item) => selectedDns.includes(item.dn)).map((item) => item.name)
    },
    [formik.values.attributes, scriptOptionsByType],
  )

  const updateScriptSelection = useCallback(
    (field: ClientScriptField, selectedNames: string[]) => {
      const options = scriptOptionsByType[field.name] ?? []
      const selectedDns = options
        .filter((item) => selectedNames.includes(item.name))
        .map((item) => item.dn)

      formik.setFieldValue(field.name, selectedDns)
      setModifiedFields((prev) => ({
        ...prev,
        [field.modifiedField]: selectedNames,
      }))
    },
    [formik, scriptOptionsByType, setModifiedFields],
  )

  return (
    <div className={classes.root}>
      {CLIENT_SCRIPT_FIELDS.map((field) => {
        const options = (scriptOptionsByType[field.name] ?? []).map((item) => item.name)
        return (
          <div key={field.name} className={classes.fieldWrap}>
            <GluuAutocomplete
              name={field.name}
              label={t(field.labelKey)}
              value={getSelectedScriptNames(field.name)}
              options={options}
              onChange={(selectedNames: string[]) => updateScriptSelection(field, selectedNames)}
              onBlur={() => formik.setFieldTouched?.(field.name, true, false)}
              disabled={viewOnly}
              doc_category={DOC_CATEGORY}
            />
            <GluuText variant="p" className={classes.helperText} secondary>
              {t('messages.multi_select_hint')}
            </GluuText>
          </div>
        )
      })}
      {scripts.length === 0 && (
        <div className={classes.emptyState}>
          <GluuText variant="p" secondary>
            {t('messages.no_data_found')}
          </GluuText>
        </div>
      )}
    </div>
  )
}

export default ClientScriptPanel
