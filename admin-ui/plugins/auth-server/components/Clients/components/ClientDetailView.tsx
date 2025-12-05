import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid, Typography, Chip, Paper, IconButton, Tooltip } from '@mui/material'
import { ContentCopy } from '@mui/icons-material'
import { Badge } from 'reactstrap'
import { useDispatch } from 'react-redux'
import { ThemeContext } from 'Context/theme/themeContext'
import { updateToast } from 'Redux/features/toastSlice'
import type { Client } from '../types'
import { formatGrantTypeLabel, formatResponseTypeLabel, formatScopeDisplay } from '../helper/utils'

interface ScopeItem {
  dn?: string
  id?: string
  displayName?: string
}

interface ClientDetailViewProps {
  client: Client
  scopes?: ScopeItem[]
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client, scopes = [] }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = useMemo(() => theme?.state?.theme || 'light', [theme?.state?.theme])

  const handleCopyClientId = () => {
    if (client.inum) {
      navigator.clipboard.writeText(client.inum)
      dispatch(updateToast(true, 'success', t('messages.client_id_copied')))
    }
  }

  const handleCopyClientSecret = () => {
    if (client.clientSecret) {
      navigator.clipboard.writeText(client.clientSecret)
      dispatch(updateToast(true, 'success', t('messages.client_secret_copied')))
    }
  }

  const getScopeNames = (): string[] => {
    if (!client.scopes || client.scopes.length === 0) return []
    const matchedScopes = scopes
      .filter((scope) => scope.dn && client.scopes?.includes(scope.dn))
      .map((scope) => scope.id || scope.displayName || '')
      .filter(Boolean)

    const matchedDns = scopes.filter((s) => s.dn && client.scopes?.includes(s.dn)).map((s) => s.dn)
    const unmatchedScopes = client.scopes
      .filter((s) => !matchedDns.includes(s))
      .map((s) => formatScopeDisplay(s))

    return [...matchedScopes, ...unmatchedScopes]
  }

  const labelSx = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'text.secondary',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  }

  const valueSx = {
    fontSize: '0.85rem',
    fontWeight: 400,
    color: 'text.primary',
    wordBreak: 'break-word' as const,
  }

  const chipSx = {
    fontSize: '0.7rem',
    height: 24,
    backgroundColor: 'action.hover',
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, flex: 1 }}>
          {client.displayName || client.clientName || t('fields.unnamed_client')}
        </Typography>
        <Badge color={client.disabled ? `danger-${selectedTheme}` : `primary-${selectedTheme}`}>
          {client.disabled ? t('fields.disabled') : t('fields.active')}
        </Badge>
      </Box>

      <Grid container spacing={1.5}>
        <Grid item xs={12} sm={4}>
          <Typography sx={labelSx}>{t('fields.client_id')}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={valueSx}>{client.inum}</Typography>
            {client.inum && (
              <Tooltip title={t('actions.copy')}>
                <IconButton onClick={handleCopyClientId} size="small" sx={{ p: 0.25 }}>
                  <ContentCopy sx={{ fontSize: '0.9rem' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography sx={labelSx}>{t('fields.client_secret')}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={valueSx}>{client.clientSecret ? '••••••••••••' : '-'}</Typography>
            {client.clientSecret && (
              <Tooltip title={t('actions.copy')}>
                <IconButton onClick={handleCopyClientSecret} size="small" sx={{ p: 0.25 }}>
                  <ContentCopy sx={{ fontSize: '0.9rem' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography sx={labelSx}>{t('fields.application_type')}</Typography>
          <Typography sx={valueSx}>{client.applicationType || '-'}</Typography>
        </Grid>

        {client.grantTypes && client.grantTypes.length > 0 && (
          <Grid item xs={12} sm={4}>
            <Typography sx={{ ...labelSx, mb: 0.5 }}>{t('fields.grant_types')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {client.grantTypes.map((g, i) => (
                <Chip key={i} label={formatGrantTypeLabel(g)} size="small" sx={chipSx} />
              ))}
            </Box>
          </Grid>
        )}
        {client.responseTypes && client.responseTypes.length > 0 && (
          <Grid item xs={12} sm={4}>
            <Typography sx={{ ...labelSx, mb: 0.5 }}>{t('fields.response_types')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {client.responseTypes.map((r, i) => (
                <Chip key={i} label={formatResponseTypeLabel(r)} size="small" sx={chipSx} />
              ))}
            </Box>
          </Grid>
        )}
        <Grid item xs={12} sm={4}>
          {client.description ? (
            <>
              <Typography sx={labelSx}>{t('fields.description')}</Typography>
              <Typography sx={valueSx}>{client.description}</Typography>
            </>
          ) : (
            <>
              <Typography sx={labelSx}>{t('fields.subject_type')}</Typography>
              <Typography sx={valueSx}>{client.subjectType || '-'}</Typography>
            </>
          )}
        </Grid>

        {client.scopes && client.scopes.length > 0 && (
          <Grid item xs={12}>
            <Typography sx={{ ...labelSx, mb: 0.5 }}>{t('fields.scopes')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getScopeNames().map((name, i) => (
                <Chip key={i} label={name} size="small" sx={chipSx} />
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}

export default ClientDetailView
