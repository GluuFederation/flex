import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ExtensionOutlined } from '@/components/icons'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import GluuAutocomplete from 'Routes/Apps/Gluu/GluuAutocomplete'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { DOC_CATEGORY, CLIENT_SCRIPT_FIELDS } from '../constants'
import { useStyles } from './styles/ClientScriptPanel.style'
import type { ClientScriptPanelProps, ClientScriptField } from '../types'

const ClientScriptPanel = ({
  scripts,
  formik,
  viewOnly,
  modifiedFields: _modifiedFields,
  setModifiedFields,
}: ClientScriptPanelProps) => {
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

  const getSelectedScriptDns = useCallback(
    (fieldName: string): string[] => {
      const key = fieldName.split('.').pop() ?? ''
      const rawValue = formik.values.attributes?.[key]
      return Array.isArray(rawValue)
        ? rawValue.filter((v): v is string => typeof v === 'string')
        : []
    },
    [formik.values.attributes],
  )

  const updateScriptSelection = useCallback(
    (field: ClientScriptField, selectedDns: string[]) => {
      const names = (scriptOptionsByType[field.name] ?? [])
        .filter((item) => selectedDns.includes(item.dn))
        .map((item) => item.name)

      formik.setFieldValue(field.name, selectedDns)
      setModifiedFields((prev) => ({
        ...prev,
        [field.modifiedField]: names,
      }))
    },
    [formik, scriptOptionsByType, setModifiedFields],
  )

  return (
    <div className={classes.root}>
      {CLIENT_SCRIPT_FIELDS.map((field) => {
        const options = (scriptOptionsByType[field.name] ?? []).map((item) => ({
          value: item.dn,
          label: item.name,
        }))
        return (
          <div key={field.name} className={classes.fieldWrap}>
            <GluuAutocomplete
              name={field.name}
              label={t(field.labelKey)}
              value={getSelectedScriptDns(field.name)}
              options={options}
              onChange={(selectedDns: string[]) => updateScriptSelection(field, selectedDns)}
              onBlur={() => formik.setFieldTouched?.(field.name, true, false)}
              disabled={viewOnly}
              doc_category={DOC_CATEGORY}
            />
          </div>
        )
      })}
      {Object.values(scriptOptionsByType).every((opts) => opts.length === 0) && (
        <div className={classes.emptyState}>
          <ExtensionOutlined className={classes.emptyStateIcon} aria-hidden />
          <GluuText variant="p" className={classes.emptyStateTitle} disableThemeColor>
            {t('messages.no_scripts_found')}
          </GluuText>
          <GluuText variant="p" className={classes.emptyStateDescription} disableThemeColor>
            {t('messages.no_scripts_for_client')}
          </GluuText>
        </div>
      )}
    </div>
  )
}

export default ClientScriptPanel
