import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid, TextField, Typography } from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { SectionProps } from '../types'
import { TOKEN_ENDPOINT_AUTH_METHODS } from '../helper/constants'

type SelectOption = string | { value: string; label: string }

interface AlgorithmSelectProps {
  label: string
  name: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  disabled: boolean
  fieldStyle: object
  placeholder: string
}

const AlgorithmSelect: React.FC<AlgorithmSelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  disabled,
  fieldStyle,
  placeholder,
}) => (
  <TextField
    fullWidth
    select
    size="small"
    label={label}
    name={name}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    sx={fieldStyle}
    SelectProps={{ native: true }}
    InputLabelProps={{ shrink: true }}
  >
    <option value="">{placeholder}</option>
    {options.map((opt) => {
      const optValue = typeof opt === 'string' ? opt : opt.value
      const optLabel = typeof opt === 'string' ? opt : opt.label
      return (
        <option key={optValue} value={optValue}>
          {optLabel}
        </option>
      )
    })}
  </TextField>
)

const AuthenticationSection: React.FC<SectionProps> = ({
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

  const handleAttributeChange = useCallback(
    (attrName: string, fieldLabel: string, value: unknown) => {
      formik.setFieldValue(`attributes.${attrName}`, value)
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

  const signingAlgorithms = useMemo(
    () => [...new Set((oidcConfiguration?.idTokenSigningAlgValuesSupported as string[]) || [])],
    [oidcConfiguration],
  )

  const encryptionAlgorithms = useMemo(
    () => [...new Set((oidcConfiguration?.idTokenEncryptionAlgValuesSupported as string[]) || [])],
    [oidcConfiguration],
  )

  const encryptionEncodings = useMemo(
    () => [...new Set((oidcConfiguration?.idTokenEncryptionEncValuesSupported as string[]) || [])],
    [oidcConfiguration],
  )

  const accessTokenSigningAlgs = useMemo(
    () => [
      ...new Set(
        (oidcConfiguration?.accessTokenSigningAlgValuesSupported as string[]) || signingAlgorithms,
      ),
    ],
    [oidcConfiguration, signingAlgorithms],
  )

  return (
    <Box>
      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.token_endpoint_auth')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <AlgorithmSelect
              label={t('fields.token_endpoint_auth_method')}
              name="tokenEndpointAuthMethod"
              value={formik.values.tokenEndpointAuthMethod || ''}
              options={TOKEN_ENDPOINT_AUTH_METHODS}
              onChange={(value) =>
                handleFieldChange(
                  'tokenEndpointAuthMethod',
                  t('fields.token_endpoint_auth_method'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AlgorithmSelect
              label={t('fields.token_endpoint_auth_signing_alg')}
              name="tokenEndpointAuthSigningAlg"
              value={formik.values.tokenEndpointAuthSigningAlg || ''}
              options={signingAlgorithms}
              onChange={(value) =>
                handleFieldChange(
                  'tokenEndpointAuthSigningAlg',
                  t('fields.token_endpoint_auth_signing_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.jwks_uri')}
              InputLabelProps={{ shrink: true }}
              name="jwksUri"
              value={formik.values.jwksUri || ''}
              onChange={(e) => handleFieldChange('jwksUri', t('fields.jwks_uri'), e.target.value)}
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.jwks')}
              InputLabelProps={{ shrink: true }}
              name="jwks"
              value={formik.values.jwks || ''}
              onChange={(e) => handleFieldChange('jwks', t('fields.jwks'), e.target.value)}
              disabled={viewOnly}
              multiline
              rows={3}
              sx={fieldStyle}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.id_token')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.id_token_signed_response_alg')}
              name="idTokenSignedResponseAlg"
              value={formik.values.idTokenSignedResponseAlg || ''}
              options={signingAlgorithms}
              onChange={(value) =>
                handleFieldChange(
                  'idTokenSignedResponseAlg',
                  t('fields.id_token_signed_response_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.id_token_encrypted_response_alg')}
              name="idTokenEncryptedResponseAlg"
              value={formik.values.idTokenEncryptedResponseAlg || ''}
              options={encryptionAlgorithms}
              onChange={(value) =>
                handleFieldChange(
                  'idTokenEncryptedResponseAlg',
                  t('fields.id_token_encrypted_response_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.id_token_encrypted_response_enc')}
              name="idTokenEncryptedResponseEnc"
              value={formik.values.idTokenEncryptedResponseEnc || ''}
              options={encryptionEncodings}
              onChange={(value) =>
                handleFieldChange(
                  'idTokenEncryptedResponseEnc',
                  t('fields.id_token_encrypted_response_enc'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.access_token')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <AlgorithmSelect
              label={t('fields.access_token_signing_alg')}
              name="accessTokenSigningAlg"
              value={formik.values.accessTokenSigningAlg || ''}
              options={accessTokenSigningAlgs}
              onChange={(value) =>
                handleFieldChange(
                  'accessTokenSigningAlg',
                  t('fields.access_token_signing_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.userinfo')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.userinfo_signed_response_alg')}
              name="userInfoSignedResponseAlg"
              value={formik.values.userInfoSignedResponseAlg || ''}
              options={signingAlgorithms}
              onChange={(value) =>
                handleFieldChange(
                  'userInfoSignedResponseAlg',
                  t('fields.userinfo_signed_response_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.userinfo_encrypted_response_alg')}
              name="userInfoEncryptedResponseAlg"
              value={formik.values.userInfoEncryptedResponseAlg || ''}
              options={encryptionAlgorithms}
              onChange={(value) =>
                handleFieldChange(
                  'userInfoEncryptedResponseAlg',
                  t('fields.userinfo_encrypted_response_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.userinfo_encrypted_response_enc')}
              name="userInfoEncryptedResponseEnc"
              value={formik.values.userInfoEncryptedResponseEnc || ''}
              options={encryptionEncodings}
              onChange={(value) =>
                handleFieldChange(
                  'userInfoEncryptedResponseEnc',
                  t('fields.userinfo_encrypted_response_enc'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.request_object')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.request_object_signing_alg')}
              name="requestObjectSigningAlg"
              value={formik.values.requestObjectSigningAlg || ''}
              options={signingAlgorithms}
              onChange={(value) =>
                handleFieldChange(
                  'requestObjectSigningAlg',
                  t('fields.request_object_signing_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.request_object_encryption_alg')}
              name="requestObjectEncryptionAlg"
              value={formik.values.requestObjectEncryptionAlg || ''}
              options={encryptionAlgorithms}
              onChange={(value) =>
                handleFieldChange(
                  'requestObjectEncryptionAlg',
                  t('fields.request_object_encryption_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.request_object_encryption_enc')}
              name="requestObjectEncryptionEnc"
              value={formik.values.requestObjectEncryptionEnc || ''}
              options={encryptionEncodings}
              onChange={(value) =>
                handleFieldChange(
                  'requestObjectEncryptionEnc',
                  t('fields.request_object_encryption_enc'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.introspection')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.introspection_signed_response_alg')}
              name="attributes.introspectionSignedResponseAlg"
              value={formik.values.attributes?.introspectionSignedResponseAlg || ''}
              options={signingAlgorithms}
              onChange={(value) =>
                handleAttributeChange(
                  'introspectionSignedResponseAlg',
                  t('fields.introspection_signed_response_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.introspection_encrypted_response_alg')}
              name="attributes.introspectionEncryptedResponseAlg"
              value={formik.values.attributes?.introspectionEncryptedResponseAlg || ''}
              options={encryptionAlgorithms}
              onChange={(value) =>
                handleAttributeChange(
                  'introspectionEncryptedResponseAlg',
                  t('fields.introspection_encrypted_response_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.introspection_encrypted_response_enc')}
              name="attributes.introspectionEncryptedResponseEnc"
              value={formik.values.attributes?.introspectionEncryptedResponseEnc || ''}
              options={encryptionEncodings}
              onChange={(value) =>
                handleAttributeChange(
                  'introspectionEncryptedResponseEnc',
                  t('fields.introspection_encrypted_response_enc'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.jarm')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.jans_auth_signed_resp_alg')}
              name="attributes.jansAuthSignedRespAlg"
              value={formik.values.attributes?.jansAuthSignedRespAlg || ''}
              options={signingAlgorithms}
              onChange={(value) =>
                handleAttributeChange(
                  'jansAuthSignedRespAlg',
                  t('fields.jans_auth_signed_resp_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.jans_auth_enc_resp_alg')}
              name="attributes.jansAuthEncRespAlg"
              value={formik.values.attributes?.jansAuthEncRespAlg || ''}
              options={encryptionAlgorithms}
              onChange={(value) =>
                handleAttributeChange(
                  'jansAuthEncRespAlg',
                  t('fields.jans_auth_enc_resp_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.jans_auth_enc_resp_enc')}
              name="attributes.jansAuthEncRespEnc"
              value={formik.values.attributes?.jansAuthEncRespEnc || ''}
              options={encryptionEncodings}
              onChange={(value) =>
                handleAttributeChange(
                  'jansAuthEncRespEnc',
                  t('fields.jans_auth_enc_resp_enc'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.tx_token')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.tx_token_signed_response_alg')}
              name="attributes.txTokenSignedResponseAlg"
              value={formik.values.attributes?.txTokenSignedResponseAlg || ''}
              options={signingAlgorithms}
              onChange={(value) =>
                handleAttributeChange(
                  'txTokenSignedResponseAlg',
                  t('fields.tx_token_signed_response_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.tx_token_encrypted_response_alg')}
              name="attributes.txTokenEncryptedResponseAlg"
              value={formik.values.attributes?.txTokenEncryptedResponseAlg || ''}
              options={encryptionAlgorithms}
              onChange={(value) =>
                handleAttributeChange(
                  'txTokenEncryptedResponseAlg',
                  t('fields.tx_token_encrypted_response_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AlgorithmSelect
              label={t('fields.tx_token_encrypted_response_enc')}
              name="attributes.txTokenEncryptedResponseEnc"
              value={formik.values.attributes?.txTokenEncryptedResponseEnc || ''}
              options={encryptionEncodings}
              onChange={(value) =>
                handleAttributeChange(
                  'txTokenEncryptedResponseEnc',
                  t('fields.tx_token_encrypted_response_enc'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.logout')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <AlgorithmSelect
              label={t('fields.logout_status_jwt_signed_response_alg')}
              name="attributes.logoutStatusJwtSignedResponseAlg"
              value={formik.values.attributes?.logoutStatusJwtSignedResponseAlg || ''}
              options={signingAlgorithms}
              onChange={(value) =>
                handleAttributeChange(
                  'logoutStatusJwtSignedResponseAlg',
                  t('fields.logout_status_jwt_signed_response_alg'),
                  value,
                )
              }
              disabled={viewOnly}
              fieldStyle={fieldStyle}
              placeholder={`${t('actions.choose')}...`}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default AuthenticationSection
