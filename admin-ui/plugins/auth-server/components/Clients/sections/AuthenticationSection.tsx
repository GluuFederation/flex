import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid, TextField, Typography } from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { SectionProps } from '../types'
import { TOKEN_ENDPOINT_AUTH_METHODS } from '../helper/constants'

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

  const sectionTitleStyle = useMemo(
    () => ({
      mb: 2,
      fontWeight: selectedTheme === 'darkBlack' ? 700 : 600,
      color: selectedTheme === 'darkBlack' ? '#000000' : themeColors?.fontColor || '#333',
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
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.token_endpoint_auth_method')}
              name="tokenEndpointAuthMethod"
              value={formik.values.tokenEndpointAuthMethod || ''}
              onChange={(e) =>
                handleFieldChange(
                  'tokenEndpointAuthMethod',
                  t('fields.token_endpoint_auth_method'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {TOKEN_ENDPOINT_AUTH_METHODS.map((option) => (
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
              label={t('fields.token_endpoint_auth_signing_alg')}
              name="tokenEndpointAuthSigningAlg"
              value={formik.values.tokenEndpointAuthSigningAlg || ''}
              onChange={(e) =>
                handleFieldChange(
                  'tokenEndpointAuthSigningAlg',
                  t('fields.token_endpoint_auth_signing_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {signingAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
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
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.id_token_signed_response_alg')}
              name="idTokenSignedResponseAlg"
              value={formik.values.idTokenSignedResponseAlg || ''}
              onChange={(e) =>
                handleFieldChange(
                  'idTokenSignedResponseAlg',
                  t('fields.id_token_signed_response_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {signingAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.id_token_encrypted_response_alg')}
              name="idTokenEncryptedResponseAlg"
              value={formik.values.idTokenEncryptedResponseAlg || ''}
              onChange={(e) =>
                handleFieldChange(
                  'idTokenEncryptedResponseAlg',
                  t('fields.id_token_encrypted_response_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.id_token_encrypted_response_enc')}
              name="idTokenEncryptedResponseEnc"
              value={formik.values.idTokenEncryptedResponseEnc || ''}
              onChange={(e) =>
                handleFieldChange(
                  'idTokenEncryptedResponseEnc',
                  t('fields.id_token_encrypted_response_enc'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionEncodings.map((enc) => (
                <option key={enc} value={enc}>
                  {enc}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.access_token')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.access_token_signing_alg')}
              name="accessTokenSigningAlg"
              value={formik.values.accessTokenSigningAlg || ''}
              onChange={(e) =>
                handleFieldChange(
                  'accessTokenSigningAlg',
                  t('fields.access_token_signing_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {accessTokenSigningAlgs.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.userinfo')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.userinfo_signed_response_alg')}
              name="userInfoSignedResponseAlg"
              value={formik.values.userInfoSignedResponseAlg || ''}
              onChange={(e) =>
                handleFieldChange(
                  'userInfoSignedResponseAlg',
                  t('fields.userinfo_signed_response_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {signingAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.userinfo_encrypted_response_alg')}
              name="userInfoEncryptedResponseAlg"
              value={formik.values.userInfoEncryptedResponseAlg || ''}
              onChange={(e) =>
                handleFieldChange(
                  'userInfoEncryptedResponseAlg',
                  t('fields.userinfo_encrypted_response_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.userinfo_encrypted_response_enc')}
              name="userInfoEncryptedResponseEnc"
              value={formik.values.userInfoEncryptedResponseEnc || ''}
              onChange={(e) =>
                handleFieldChange(
                  'userInfoEncryptedResponseEnc',
                  t('fields.userinfo_encrypted_response_enc'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionEncodings.map((enc) => (
                <option key={enc} value={enc}>
                  {enc}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.request_object')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.request_object_signing_alg')}
              name="requestObjectSigningAlg"
              value={formik.values.requestObjectSigningAlg || ''}
              onChange={(e) =>
                handleFieldChange(
                  'requestObjectSigningAlg',
                  t('fields.request_object_signing_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {signingAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.request_object_encryption_alg')}
              name="requestObjectEncryptionAlg"
              value={formik.values.requestObjectEncryptionAlg || ''}
              onChange={(e) =>
                handleFieldChange(
                  'requestObjectEncryptionAlg',
                  t('fields.request_object_encryption_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.request_object_encryption_enc')}
              name="requestObjectEncryptionEnc"
              value={formik.values.requestObjectEncryptionEnc || ''}
              onChange={(e) =>
                handleFieldChange(
                  'requestObjectEncryptionEnc',
                  t('fields.request_object_encryption_enc'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionEncodings.map((enc) => (
                <option key={enc} value={enc}>
                  {enc}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.introspection')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.introspection_signed_response_alg')}
              name="attributes.introspectionSignedResponseAlg"
              value={formik.values.attributes?.introspectionSignedResponseAlg || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'introspectionSignedResponseAlg',
                  t('fields.introspection_signed_response_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {signingAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.introspection_encrypted_response_alg')}
              name="attributes.introspectionEncryptedResponseAlg"
              value={formik.values.attributes?.introspectionEncryptedResponseAlg || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'introspectionEncryptedResponseAlg',
                  t('fields.introspection_encrypted_response_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.introspection_encrypted_response_enc')}
              name="attributes.introspectionEncryptedResponseEnc"
              value={formik.values.attributes?.introspectionEncryptedResponseEnc || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'introspectionEncryptedResponseEnc',
                  t('fields.introspection_encrypted_response_enc'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionEncodings.map((enc) => (
                <option key={enc} value={enc}>
                  {enc}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.jarm')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.jans_auth_signed_resp_alg')}
              name="attributes.jansAuthSignedRespAlg"
              value={formik.values.attributes?.jansAuthSignedRespAlg || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'jansAuthSignedRespAlg',
                  t('fields.jans_auth_signed_resp_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {signingAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.jans_auth_enc_resp_alg')}
              name="attributes.jansAuthEncRespAlg"
              value={formik.values.attributes?.jansAuthEncRespAlg || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'jansAuthEncRespAlg',
                  t('fields.jans_auth_enc_resp_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.jans_auth_enc_resp_enc')}
              name="attributes.jansAuthEncRespEnc"
              value={formik.values.attributes?.jansAuthEncRespEnc || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'jansAuthEncRespEnc',
                  t('fields.jans_auth_enc_resp_enc'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionEncodings.map((enc) => (
                <option key={enc} value={enc}>
                  {enc}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.tx_token')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.tx_token_signed_response_alg')}
              name="attributes.txTokenSignedResponseAlg"
              value={formik.values.attributes?.txTokenSignedResponseAlg || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'txTokenSignedResponseAlg',
                  t('fields.tx_token_signed_response_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {signingAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.tx_token_encrypted_response_alg')}
              name="attributes.txTokenEncryptedResponseAlg"
              value={formik.values.attributes?.txTokenEncryptedResponseAlg || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'txTokenEncryptedResponseAlg',
                  t('fields.tx_token_encrypted_response_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.tx_token_encrypted_response_enc')}
              name="attributes.txTokenEncryptedResponseEnc"
              value={formik.values.attributes?.txTokenEncryptedResponseEnc || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'txTokenEncryptedResponseEnc',
                  t('fields.tx_token_encrypted_response_enc'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {encryptionEncodings.map((enc) => (
                <option key={enc} value={enc}>
                  {enc}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.logout')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.logout_status_jwt_signed_response_alg')}
              name="attributes.logoutStatusJwtSignedResponseAlg"
              value={formik.values.attributes?.logoutStatusJwtSignedResponseAlg || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'logoutStatusJwtSignedResponseAlg',
                  t('fields.logout_status_jwt_signed_response_alg'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {signingAlgorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default AuthenticationSection
