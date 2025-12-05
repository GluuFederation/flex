import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid, Typography, Chip, Paper } from '@mui/material'
import { Badge } from 'reactstrap'
import { ThemeContext } from 'Context/theme/themeContext'
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
  const theme = useContext(ThemeContext)
  const selectedTheme = useMemo(() => theme?.state?.theme || 'light', [theme?.state?.theme])

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
    fontSize: '0.7rem',
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
          <Typography sx={valueSx}>{client.inum}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography sx={labelSx}>{t('fields.client_name')}</Typography>
          <Typography sx={valueSx}>{client.clientName || '-'}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography sx={labelSx}>{t('fields.application_type')}</Typography>
          <Typography sx={valueSx}>{client.applicationType || '-'}</Typography>
        </Grid>

        {client.description && (
          <Grid item xs={12}>
            <Typography sx={labelSx}>{t('fields.description')}</Typography>
            <Typography sx={valueSx}>{client.description}</Typography>
          </Grid>
        )}

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

        {client.grantTypes && client.grantTypes.length > 0 && (
          <Grid item xs={12} sm={6}>
            <Typography sx={{ ...labelSx, mb: 0.5 }}>{t('fields.grant_types')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {client.grantTypes.map((g, i) => (
                <Chip key={i} label={formatGrantTypeLabel(g)} size="small" sx={chipSx} />
              ))}
            </Box>
          </Grid>
        )}
        {client.responseTypes && client.responseTypes.length > 0 && (
          <Grid item xs={12} sm={6}>
            <Typography sx={{ ...labelSx, mb: 0.5 }}>{t('fields.response_types')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {client.responseTypes.map((r, i) => (
                <Chip key={i} label={formatResponseTypeLabel(r)} size="small" sx={chipSx} />
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}

export default ClientDetailView
