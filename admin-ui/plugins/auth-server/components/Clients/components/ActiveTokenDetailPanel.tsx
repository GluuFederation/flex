import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid, Typography, Chip, Alert } from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { TokenEntity } from 'JansConfigApi'
import { formatDateTime } from '../helper/utils'

/**
 * Token attributes may contain custom claims and metadata added during token issuance.
 * These can include user identifiers, session data, or custom application-specific values.
 * Administrators should be aware that this data is visible to users with token management permissions.
 */

interface ActiveTokenDetailPanelProps {
  rowData: TokenEntity
}

const ActiveTokenDetailPanel: React.FC<ActiveTokenDetailPanelProps> = ({ rowData }) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const labelSx = {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'text.secondary',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    mb: 0.5,
  }

  const valueSx = {
    fontSize: '0.875rem',
    fontWeight: 400,
    color: 'text.primary',
    wordBreak: 'break-word' as const,
  }

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'action.hover',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelSx}>{t('fields.creationDate')}</Typography>
          <Typography sx={valueSx}>{formatDateTime(rowData.creationDate)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelSx}>{t('fields.expiration_date')}</Typography>
          <Typography sx={valueSx}>{formatDateTime(rowData.expirationDate)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelSx}>{t('fields.token_type')}</Typography>
          <Typography sx={valueSx}>{rowData.tokenType || '--'}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelSx}>{t('fields.grant_type')}</Typography>
          <Typography sx={valueSx}>{rowData.grantType || '--'}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelSx}>{t('fields.scope')}</Typography>
          <Typography sx={valueSx}>{rowData.scope || '--'}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelSx}>{t('fields.deletable')}</Typography>
          <Chip
            label={rowData.deletable ? t('options.yes') : t('options.no')}
            size="small"
            sx={{
              mt: 0.5,
              backgroundColor: rowData.deletable ? themeColors?.background : undefined,
              color: rowData.deletable ? '#fff' : undefined,
            }}
          />
        </Grid>

        {rowData.attributes && Object.keys(rowData.attributes).length > 0 && (
          <Grid item xs={12}>
            <Typography sx={labelSx}>{t('fields.attributes')}</Typography>
            <Alert severity="info" sx={{ mb: 1, py: 0 }}>
              <Typography variant="caption">{t('messages.token_attributes_notice')}</Typography>
            </Alert>
            <Box
              component="pre"
              sx={{
                ...valueSx,
                backgroundColor: 'background.paper',
                p: 1,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 200,
                fontSize: '0.75rem',
                fontFamily: 'monospace',
              }}
            >
              {JSON.stringify(rowData.attributes, null, 2)}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default ActiveTokenDetailPanel
