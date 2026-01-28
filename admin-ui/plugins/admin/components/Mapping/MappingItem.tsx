import React, { useContext } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Box } from '@mui/material'
import { ExpandMore, SecurityOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { MappingItemProps, ThemeContextValue } from './types'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import customColors from '@/customColors'

const MappingItem: React.FC<MappingItemProps> = React.memo(function MappingItem({ candidate }) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext) as ThemeContextValue | undefined
  const selectedTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)
  const isDarkTheme = selectedTheme === THEME_DARK

  const permissionsCount = candidate?.permissions?.length || 0

  const permissionChips = candidate?.permissions?.map((permission, idx) => (
    <Chip
      key={`${permission}-${idx}`}
      label={permission}
      size="small"
      variant="outlined"
      sx={{
        borderColor: isDarkTheme ? themeColors.borderColor : customColors.lightBorder,
        color: isDarkTheme ? themeColors.fontColor : customColors.primaryDark,
        fontSize: '0.85rem',
        fontWeight: 600,
        height: 32,
      }}
    />
  ))

  return (
    <Accordion
      sx={{
        'mb': 1.5,
        'border': '1px solid',
        'borderColor': 'divider',
        'borderRadius': '8px !important',
        '&:before': { display: 'none' },
        'boxShadow': '0 1px 3px rgba(0,0,0,0.08)',
        '&.Mui-expanded': {
          margin: '0 0 12px 0',
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMore
            sx={{ color: isDarkTheme ? themeColors.fontColor : customColors.textSecondary }}
          />
        }
        sx={{
          'borderRadius': '8px',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SecurityOutlined
            sx={{
              color: isDarkTheme ? themeColors.fontColor : customColors.textSecondary,
              fontSize: 22,
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {candidate?.role}
          </Typography>
        </Box>
        <Chip
          label={t('messages.permissions_count', { count: permissionsCount })}
          size="small"
          sx={{
            backgroundColor: isDarkTheme ? themeColors.background : customColors.lightBlue,
            color: customColors.white,
            fontWeight: 500,
            fontSize: '0.75rem',
            mr: 1,
          }}
        />
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          pt: 2,
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {permissionChips}
        </Box>
        {permissionsCount === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {t('messages.no_permissions_assigned')}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  )
})

export default MappingItem
