import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid, Typography, Chip } from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { TokenEntity } from 'JansConfigApi'

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

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '--'
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
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
          <Typography sx={valueSx}>{formatDate(rowData.creationDate)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelSx}>{t('fields.expiration_date')}</Typography>
          <Typography sx={valueSx}>{formatDate(rowData.expirationDate)}</Typography>
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
          <Typography sx={labelSx}>{t('fields.deleteable')}</Typography>
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
