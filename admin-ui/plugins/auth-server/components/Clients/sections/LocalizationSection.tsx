import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid, Typography } from '@mui/material'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/theme-monokai'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { SectionProps } from '../types'

const LocalizationSection: React.FC<SectionProps> = ({
  formik,
  viewOnly = false,
  setModifiedFields,
}) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const [editorValues, setEditorValues] = useState<Record<string, string>>({})

  const handleFieldChange = useCallback(
    (fieldName: string, fieldLabel: string, value: unknown) => {
      formik.setFieldValue(fieldName, value)
      setModifiedFields((prev) => ({
        ...prev,
        [fieldLabel]: value,
      }))
    },
    [formik, setModifiedFields],
  )

  const sectionStyle = useMemo(
    () => ({
      mb: 3,
      p: 2,
      borderRadius: 1,
      border: `1px solid ${themeColors?.lightBackground || '#e0e0e0'}`,
      backgroundColor: themeColors?.lightBackground || '#fafafa',
    }),
    [themeColors],
  )

  const sectionTitleStyle = useMemo(
    () => ({
      mb: 2,
      fontWeight: selectedTheme === 'darkBlack' ? 700 : 600,
      color: selectedTheme === 'darkBlack' ? '#000000' : themeColors?.fontColor || '#333',
      fontSize: '0.95rem',
    }),
    [themeColors, selectedTheme],
  )

  const labelStyle = useMemo(
    () => ({
      mb: 1,
      fontWeight: 500,
      fontSize: '0.875rem',
      color: themeColors?.fontColor || '#333',
    }),
    [themeColors],
  )

  const editorContainerStyle = useMemo(
    () => ({
      borderRadius: '4px',
      border: `1px solid ${themeColors?.lightBackground || '#e0e0e0'}`,
      overflow: 'hidden',
    }),
    [themeColors],
  )

  const helperTextStyle = useMemo(
    () => ({
      mt: 0.5,
      fontSize: '0.75rem',
      color: 'text.secondary',
    }),
    [],
  )

  const getEditorValue = useCallback(
    (fieldName: string, formikValue: Record<string, string> | undefined): string => {
      if (editorValues[fieldName] !== undefined) {
        return editorValues[fieldName]
      }
      if (formikValue && Object.keys(formikValue).length > 0) {
        return JSON.stringify(formikValue, null, 2)
      }
      return '{}'
    },
    [editorValues],
  )

  const handleEditorChange = useCallback(
    (fieldName: string, fieldLabel: string, newValue: string) => {
      setEditorValues((prev) => ({ ...prev, [fieldName]: newValue }))
      try {
        const parsed = newValue.trim() ? JSON.parse(newValue) : {}
        handleFieldChange(fieldName, fieldLabel, parsed)
      } catch {}
    },
    [handleFieldChange],
  )

  const renderJsonEditor = useCallback(
    (label: string, fieldName: string, formikValue: Record<string, string> | undefined) => (
      <Grid item xs={12}>
        <Typography sx={labelStyle}>{label}</Typography>
        <Box sx={editorContainerStyle}>
          <AceEditor
            mode="json"
            theme={selectedTheme === 'darkBlack' ? 'monokai' : 'xcode'}
            value={getEditorValue(fieldName, formikValue)}
            onChange={(newValue) => handleEditorChange(fieldName, label, newValue)}
            name={`${fieldName}-editor`}
            width="100%"
            height="100px"
            fontSize={13}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={!viewOnly}
            readOnly={viewOnly}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </Box>
        <Typography sx={helperTextStyle}>{t('placeholders.localized_json_format')}</Typography>
      </Grid>
    ),
    [
      selectedTheme,
      viewOnly,
      labelStyle,
      editorContainerStyle,
      helperTextStyle,
      t,
      getEditorValue,
      handleEditorChange,
    ],
  )

  return (
    <Box>
      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.localized_strings')}</Typography>
        <Grid container spacing={3}>
          {renderJsonEditor(
            t('fields.client_name_localized'),
            'clientNameLocalized',
            formik.values.clientNameLocalized,
          )}

          {renderJsonEditor(
            t('fields.logo_uri_localized'),
            'logoUriLocalized',
            formik.values.logoUriLocalized,
          )}

          {renderJsonEditor(
            t('fields.client_uri_localized'),
            'clientUriLocalized',
            formik.values.clientUriLocalized,
          )}

          {renderJsonEditor(
            t('fields.policy_uri_localized'),
            'policyUriLocalized',
            formik.values.policyUriLocalized,
          )}

          {renderJsonEditor(
            t('fields.tos_uri_localized'),
            'tosUriLocalized',
            formik.values.tosUriLocalized,
          )}
        </Grid>
      </Box>
    </Box>
  )
}

export default LocalizationSection
