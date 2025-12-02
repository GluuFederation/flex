import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Grid,
  Typography,
  Chip,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { ScopesGrantsTabProps, ClientScope } from '../types'
import { GRANT_TYPES, RESPONSE_TYPES } from '../helper/constants'
import { formatScopeDisplay } from '../helper/utils'

const ScopesGrantsTab: React.FC<ScopesGrantsTabProps> = ({
  formik,
  viewOnly = false,
  modifiedFields,
  setModifiedFields,
  scopes = [],
  scopesLoading = false,
  onScopeSearch,
}) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const [scopeInputValue, setScopeInputValue] = useState('')

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

  const handleGrantTypeChange = useCallback(
    (grantType: string, checked: boolean) => {
      const currentGrants = formik.values.grantTypes || []
      const newGrants = checked
        ? [...currentGrants, grantType]
        : currentGrants.filter((g) => g !== grantType)
      handleFieldChange('grantTypes', t('fields.grant_types'), newGrants)
    },
    [formik.values.grantTypes, handleFieldChange, t],
  )

  const handleResponseTypeChange = useCallback(
    (responseType: string, checked: boolean) => {
      const currentTypes = formik.values.responseTypes || []
      const newTypes = checked
        ? [...currentTypes, responseType]
        : currentTypes.filter((r) => r !== responseType)
      handleFieldChange('responseTypes', t('fields.response_types'), newTypes)
    },
    [formik.values.responseTypes, handleFieldChange, t],
  )

  const handleScopeChange = useCallback(
    (newScopes: ClientScope[]) => {
      const scopeValues = newScopes.map((s) => s.dn || s.inum || '')
      handleFieldChange('scopes', t('fields.scopes'), scopeValues)
    },
    [handleFieldChange, t],
  )

  const handleScopeInputChange = useCallback(
    (value: string) => {
      setScopeInputValue(value)
      if (onScopeSearch && value.length >= 2) {
        onScopeSearch(value)
      }
    },
    [onScopeSearch],
  )

  const selectedScopes = useMemo(() => {
    const scopeValues = formik.values.scopes || []
    return scopeValues.map((scopeValue) => {
      const found = scopes.find((s) => s.dn === scopeValue || s.inum === scopeValue)
      return found || { dn: scopeValue, displayName: formatScopeDisplay(scopeValue) }
    })
  }, [formik.values.scopes, scopes])

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

  const chipStyle = useMemo(
    () => ({
      'm': 0.5,
      'backgroundColor': themeColors?.lightBackground || '#e3f2fd',
      '& .MuiChip-deleteIcon': {
        color: themeColors?.background || '#1976d2',
      },
    }),
    [themeColors],
  )

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('fields.scopes')}</Typography>
        {viewOnly ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(formik.values.scopes || []).map((scope, index) => (
              <Chip key={index} label={formatScopeDisplay(scope)} sx={chipStyle} size="small" />
            ))}
            {(!formik.values.scopes || formik.values.scopes.length === 0) && (
              <Typography color="text.secondary" variant="body2">
                {t('messages.no_scopes')}
              </Typography>
            )}
          </Box>
        ) : (
          <Autocomplete
            multiple
            options={scopes}
            getOptionLabel={(option) =>
              option.displayName || option.id || formatScopeDisplay(option.dn || '')
            }
            value={selectedScopes}
            onChange={(_, newValue) => handleScopeChange(newValue as ClientScope[])}
            inputValue={scopeInputValue}
            onInputChange={(_, value) => handleScopeInputChange(value)}
            loading={scopesLoading}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) =>
              option.dn === value.dn || option.inum === value.inum
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder={t('placeholders.search_scopes')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  },
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.dn || index}
                  label={option.displayName || formatScopeDisplay(option.dn || '')}
                  size="small"
                  sx={chipStyle}
                />
              ))
            }
          />
        )}
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('fields.grant_types')}</Typography>
        {viewOnly ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(formik.values.grantTypes || []).map((grant, index) => {
              const grantOption = GRANT_TYPES.find((g) => g.value === grant)
              return (
                <Chip
                  key={index}
                  label={grantOption?.label || grant}
                  sx={{ ...chipStyle, backgroundColor: '#fff3e0' }}
                  size="small"
                />
              )
            })}
            {(!formik.values.grantTypes || formik.values.grantTypes.length === 0) && (
              <Typography color="text.secondary" variant="body2">
                {t('messages.no_grant_types')}
              </Typography>
            )}
          </Box>
        ) : (
          <FormGroup>
            <Grid container spacing={1}>
              {GRANT_TYPES.map((grant) => (
                <Grid item xs={12} sm={6} md={4} key={grant.value}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={(formik.values.grantTypes || []).includes(grant.value)}
                        onChange={(e) => handleGrantTypeChange(grant.value, e.target.checked)}
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">{grant.label}</Typography>}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        )}
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('fields.response_types')}</Typography>
        {viewOnly ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(formik.values.responseTypes || []).map((type, index) => {
              const typeOption = RESPONSE_TYPES.find((r) => r.value === type)
              return (
                <Chip
                  key={index}
                  label={typeOption?.label || type}
                  sx={{ ...chipStyle, backgroundColor: '#e8f5e9' }}
                  size="small"
                />
              )
            })}
            {(!formik.values.responseTypes || formik.values.responseTypes.length === 0) && (
              <Typography color="text.secondary" variant="body2">
                {t('messages.no_response_types')}
              </Typography>
            )}
          </Box>
        ) : (
          <FormGroup row>
            {RESPONSE_TYPES.map((type) => (
              <FormControlLabel
                key={type.value}
                control={
                  <Checkbox
                    checked={(formik.values.responseTypes || []).includes(type.value)}
                    onChange={(e) => handleResponseTypeChange(type.value, e.target.checked)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">{type.label}</Typography>}
              />
            ))}
          </FormGroup>
        )}
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('fields.claims')}</Typography>
        {viewOnly ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(formik.values.claims || []).map((claim, index) => (
              <Chip
                key={index}
                label={claim}
                sx={{ ...chipStyle, backgroundColor: '#fce4ec' }}
                size="small"
              />
            ))}
            {(!formik.values.claims || formik.values.claims.length === 0) && (
              <Typography color="text.secondary" variant="body2">
                {t('messages.no_claims')}
              </Typography>
            )}
          </Box>
        ) : (
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formik.values.claims || []}
            onChange={(_, newValue) => handleFieldChange('claims', t('fields.claims'), newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder={t('placeholders.add_claims')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  },
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={index}
                  label={option}
                  size="small"
                  sx={{ ...chipStyle, backgroundColor: '#fce4ec' }}
                />
              ))
            }
          />
        )}
      </Box>
    </Box>
  )
}

export default ScopesGrantsTab
