import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Autocomplete,
  Chip,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { SectionProps } from '../types'
import { APPLICATION_TYPES, SUBJECT_TYPES } from '../helper/constants'

const BasicInfoSection: React.FC<SectionProps> = ({
  formik,
  viewOnly = false,
  setModifiedFields,
}) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const [showSecret, setShowSecret] = React.useState(false)

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

  const toggleSecretVisibility = useCallback(() => {
    setShowSecret((prev) => !prev)
  }, [])

  const fieldStyle = useMemo(
    () => ({
      '& .MuiOutlinedInput-root': {
        'backgroundColor': viewOnly ? themeColors?.lightBackground : 'white',
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: themeColors?.background,
        },
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: themeColors?.background,
      },
    }),
    [viewOnly, themeColors],
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

  const switchStyle = useMemo(
    () => ({
      '& .MuiSwitch-switchBase.Mui-checked': {
        color: themeColors?.background,
      },
      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: themeColors?.background,
      },
    }),
    [themeColors],
  )

  return (
    <Box>
      <Box sx={sectionStyle}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.client_id')}
              name="inum"
              value={formik.values.inum || ''}
              disabled
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.client_secret')}
              name="clientSecret"
              type={showSecret ? 'text' : 'password'}
              value={formik.values.clientSecret || ''}
              onChange={(e) =>
                handleFieldChange('clientSecret', t('fields.client_secret'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleSecretVisibility} edge="end" size="small">
                      {showSecret ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.client_name')}
              name="clientName"
              value={formik.values.clientName || ''}
              onChange={(e) =>
                handleFieldChange('clientName', t('fields.client_name'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.displayname')}
              name="displayName"
              value={formik.values.displayName || ''}
              onChange={(e) =>
                handleFieldChange('displayName', t('fields.displayname'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.description')}
              name="description"
              value={formik.values.description || ''}
              onChange={(e) =>
                handleFieldChange('description', t('fields.description'), e.target.value)
              }
              disabled={viewOnly}
              multiline
              rows={2}
              sx={fieldStyle}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.application_type')}
              name="applicationType"
              value={formik.values.applicationType || 'web'}
              onChange={(e) =>
                handleFieldChange('applicationType', t('fields.application_type'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
            >
              {APPLICATION_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.subject_type')}
              name="subjectType"
              value={formik.values.subjectType || 'public'}
              onChange={(e) =>
                handleFieldChange('subjectType', t('fields.subject_type'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
            >
              {SUBJECT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={!formik.values.disabled}
                  onChange={(e) =>
                    handleFieldChange('disabled', t('fields.status'), !e.target.checked)
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.active')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.trustedClient || false}
                  onChange={(e) =>
                    handleFieldChange(
                      'trustedClient',
                      t('fields.is_trusted_client'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.is_trusted_client')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.expirable || false}
                  onChange={(e) =>
                    handleFieldChange(
                      'expirable',
                      t('fields.is_expirable_client'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.is_expirable_client')}
            />
          </Grid>

          {formik.values.expirable && (
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label={t('fields.expirationDate')}
                  value={formik.values.expirationDate ? dayjs(formik.values.expirationDate) : null}
                  onChange={(newValue) => {
                    const isoValue = newValue ? newValue.toISOString() : null
                    handleFieldChange('expirationDate', t('fields.expirationDate'), isoValue)
                  }}
                  disabled={viewOnly}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      sx: fieldStyle,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.organization')}
              name="organization"
              value={formik.values.organization || ''}
              onChange={(e) =>
                handleFieldChange('organization', t('fields.organization'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formik.values.contacts || []}
              onChange={(_, newValue) =>
                handleFieldChange('contacts', t('fields.contacts'), newValue)
              }
              disabled={viewOnly}
              renderInput={(params) => (
                <TextField {...params} size="small" label={t('fields.contacts')} sx={fieldStyle} />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    sx={{ backgroundColor: themeColors?.background, color: 'white' }}
                  />
                ))
              }
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default BasicInfoSection
