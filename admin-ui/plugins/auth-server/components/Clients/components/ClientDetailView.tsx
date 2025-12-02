import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid, Typography, Chip, Divider } from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { Client } from '../types'
import { formatGrantTypeLabel, formatResponseTypeLabel, formatScopeDisplay } from '../helper/utils'

interface ClientDetailViewProps {
  client: Client
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client }) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'

  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const containerStyle = useMemo(
    () => ({
      p: 3,
      backgroundColor: themeColors?.lightBackground || '#fafafa',
    }),
    [themeColors],
  )

  const sectionStyle = useMemo(
    () => ({
      mb: 3,
    }),
    [],
  )

  const labelStyle = useMemo(
    () => ({
      fontWeight: selectedTheme === 'darkBlack' ? 700 : 600,
      color: selectedTheme === 'darkBlack' ? '#000000' : themeColors?.fontColor || '#555',
      fontSize: '0.85rem',
      mb: 0.5,
    }),
    [themeColors, selectedTheme],
  )

  const valueStyle = useMemo(
    () => ({
      fontWeight: selectedTheme === 'darkBlack' ? 600 : 400,
      color: selectedTheme === 'darkBlack' ? '#000000' : themeColors?.fontColor || '#333',
      fontSize: '0.9rem',
      wordBreak: 'break-all' as const,
    }),
    [themeColors, selectedTheme],
  )

  const sectionTitleStyle = useMemo(
    () => ({
      mb: 2,
      fontWeight: 700,
      color: themeColors?.background || '#1976d2',
    }),
    [themeColors],
  )

  const chipStyle = useMemo(
    () => ({
      m: 0.25,
      fontSize: '0.75rem',
    }),
    [],
  )

  const chipColors = useMemo(
    () => ({
      scopes: themeColors?.lightBackground || '#e3f2fd',
      grants: themeColors?.lightBackground || '#fff3e0',
      responses: themeColors?.lightBackground || '#e8f5e9',
      uris: themeColors?.lightBackground || '#e1f5fe',
      logout: themeColors?.lightBackground || '#fce4ec',
      contacts: themeColors?.lightBackground || '#f3e5f5',
    }),
    [themeColors],
  )

  const renderField = useCallback(
    (label: string, value: string | number | boolean | undefined | null) => {
      if (value === undefined || value === null || value === '') return null
      return (
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelStyle}>{label}</Typography>
          <Typography sx={valueStyle}>
            {typeof value === 'boolean'
              ? value
                ? t('options.yes')
                : t('options.no')
              : String(value)}
          </Typography>
        </Grid>
      )
    },
    [labelStyle, valueStyle, t],
  )

  const renderChipList = useCallback(
    (label: string, items: string[] | undefined, color: string) => {
      if (!items || items.length === 0) return null
      return (
        <Grid item xs={12}>
          <Typography sx={labelStyle}>{label}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {items.map((item, index) => (
              <Chip
                key={index}
                label={item}
                size="small"
                sx={{ ...chipStyle, backgroundColor: color }}
              />
            ))}
          </Box>
        </Grid>
      )
    },
    [labelStyle, chipStyle],
  )

  return (
    <Box sx={containerStyle}>
      <Box sx={sectionStyle}>
        <Typography variant="subtitle2" sx={sectionTitleStyle}>
          {t('titles.client_details')}
        </Typography>
        <Grid container spacing={2}>
          {renderField(t('fields.client_id'), client.inum)}
          {renderField(t('fields.client_name'), client.clientName)}
          {renderField(t('fields.displayname'), client.displayName)}
          {renderField(t('fields.description'), client.description)}
          {renderField(t('fields.application_type'), client.applicationType)}
          {renderField(t('fields.subject_type'), client.subjectType)}
          {renderField(
            t('fields.status'),
            client.disabled ? t('fields.disabled') : t('fields.active'),
          )}
          {renderField(t('fields.is_trusted_client'), client.trustedClient)}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={sectionStyle}>
        <Typography variant="subtitle2" sx={sectionTitleStyle}>
          {t('titles.scopes_and_grants')}
        </Typography>
        <Grid container spacing={2}>
          {renderChipList(
            t('fields.scopes'),
            client.scopes?.map((s) => formatScopeDisplay(s)),
            chipColors.scopes,
          )}
          {renderChipList(
            t('fields.grant_types'),
            client.grantTypes?.map((g) => formatGrantTypeLabel(g)),
            chipColors.grants,
          )}
          {renderChipList(
            t('fields.response_types'),
            client.responseTypes?.map((r) => formatResponseTypeLabel(r)),
            chipColors.responses,
          )}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={sectionStyle}>
        <Typography variant="subtitle2" sx={sectionTitleStyle}>
          {t('titles.uris')}
        </Typography>
        <Grid container spacing={2}>
          {renderChipList(t('fields.redirect_uris'), client.redirectUris, chipColors.uris)}
          {renderChipList(
            t('fields.post_logout_redirect_uris'),
            client.postLogoutRedirectUris,
            chipColors.logout,
          )}
          {renderField(t('fields.client_uri'), client.clientUri)}
          {renderField(t('fields.logo_uri'), client.logoUri)}
          {renderField(t('fields.policy_uri'), client.policyUri)}
          {renderField(t('fields.tos_uri'), client.tosUri)}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={sectionStyle}>
        <Typography variant="subtitle2" sx={sectionTitleStyle}>
          {t('titles.authentication')}
        </Typography>
        <Grid container spacing={2}>
          {renderField(t('fields.token_endpoint_auth_method'), client.tokenEndpointAuthMethod)}
          {renderField(t('fields.id_token_signed_response_alg'), client.idTokenSignedResponseAlg)}
          {renderField(t('fields.access_token_signing_alg'), client.accessTokenSigningAlg)}
          {renderField(t('fields.jwks_uri'), client.jwksUri)}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={sectionStyle}>
        <Typography variant="subtitle2" sx={sectionTitleStyle}>
          {t('titles.token_settings')}
        </Typography>
        <Grid container spacing={2}>
          {renderField(t('fields.access_token_lifetime'), client.accessTokenLifetime)}
          {renderField(t('fields.refresh_token_lifetime'), client.refreshTokenLifetime)}
          {renderField(t('fields.default_max_age'), client.defaultMaxAge)}
          {renderField(t('fields.access_token_as_jwt'), client.accessTokenAsJwt)}
          {renderField(t('fields.include_claims_in_id_token'), client.includeClaimsInIdToken)}
          {renderField(
            t('fields.persist_client_authorizations'),
            client.persistClientAuthorizations,
          )}
        </Grid>
      </Box>

      {client.contacts && client.contacts.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={sectionStyle}>
            <Typography variant="subtitle2" sx={sectionTitleStyle}>
              {t('titles.contacts')}
            </Typography>
            <Grid container spacing={2}>
              {renderChipList(t('fields.contacts'), client.contacts, chipColors.contacts)}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  )
}

export default ClientDetailView
