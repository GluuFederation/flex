import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid, TextField, Typography, Switch, FormControlLabel } from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { SectionProps } from '../types'
import { BACKCHANNEL_TOKEN_DELIVERY_MODES } from '../helper/constants'

const CibaSection: React.FC<SectionProps> = ({
  formik,
  viewOnly = false,
  setModifiedFields,
  oidcConfiguration,
}) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

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

  const fieldStyle = useMemo(
    () => ({
      '& .MuiOutlinedInput-root': {
        'backgroundColor': viewOnly ? themeColors?.lightBackground : 'white',
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: themeColors?.background,
        },
      },
      ...(selectedTheme === 'darkBlack' && {
        '& .MuiInputBase-input': {
          color: `${themeColors?.backgroundBlack} !important`,
        },
        '& .MuiInputBase-input.Mui-disabled': {
          WebkitTextFillColor: `${themeColors?.backgroundBlack} !important`,
        },
        '& label': {
          color: `${themeColors?.backgroundBlack} !important`,
        },
      }),
      '& .MuiInputLabel-root.Mui-focused': {
        color: themeColors?.background,
      },
    }),
    [viewOnly, themeColors, selectedTheme],
  )

  const sectionStyle = useMemo(
    () => ({
      mb: 3,
      p: 2,
      borderRadius: 1,
      border: `1px solid ${themeColors?.lightBackground || '#e0e0e0'}`,
    }),
    [themeColors],
  )

  const sectionTitleStyle = useMemo(
    () => ({
      mb: 2,
      fontWeight: selectedTheme === 'darkBlack' ? 700 : 600,
      color:
        selectedTheme === 'darkBlack'
          ? `${themeColors?.backgroundBlack} !important`
          : themeColors?.fontColor || '#333',
      fontSize: '0.95rem',
    }),
    [themeColors, selectedTheme],
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

  const backchannelSigningAlgs = useMemo(
    () =>
      (oidcConfiguration?.backchannel_authentication_request_signing_alg_values_supported as string[]) ||
      (oidcConfiguration?.id_token_signing_alg_values_supported as string[]) ||
      [],
    [oidcConfiguration],
  )

  return (
    <Box>
      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.ciba_settings')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.backchannel_token_delivery_mode')}
              name="backchannelTokenDeliveryMode"
              value={formik.values.backchannelTokenDeliveryMode || ''}
              onChange={(e) =>
                handleFieldChange(
                  'backchannelTokenDeliveryMode',
                  t('fields.backchannel_token_delivery_mode'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {BACKCHANNEL_TOKEN_DELIVERY_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.backchannel_client_notification_endpoint')}
              name="backchannelClientNotificationEndpoint"
              value={formik.values.backchannelClientNotificationEndpoint || ''}
              onChange={(e) =>
                handleFieldChange(
                  'backchannelClientNotificationEndpoint',
                  t('fields.backchannel_client_notification_endpoint'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.backchannel_auth_request_signing_alg')}
              name="backchannelAuthenticationRequestSigningAlg"
              value={formik.values.backchannelAuthenticationRequestSigningAlg || ''}
              onChange={(e) =>
                handleFieldChange(
                  'backchannelAuthenticationRequestSigningAlg',
                  t('fields.backchannel_auth_request_signing_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {backchannelSigningAlgs.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.backchannelUserCodeParameter || false}
                  onChange={(e) =>
                    handleFieldChange(
                      'backchannelUserCodeParameter',
                      t('fields.backchannel_user_code_parameter'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.backchannel_user_code_parameter')}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default CibaSection
