import React, { useContext, useMemo } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Box } from '@mui/material'
import { ExpandMore, SecurityOutlined } from '@mui/icons-material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import type { MappingItemProps, ThemeContextValue } from './types'

const MappingItem: React.FC<MappingItemProps> = React.memo(function MappingItem({ candidate }) {
  const theme = useContext(ThemeContext) as ThemeContextValue
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  const permissionsCount = useMemo(
    () => candidate?.permissions?.length || 0,
    [candidate?.permissions?.length],
  )

  const permissionChips = useMemo(
    () =>
      candidate?.permissions?.map((permission, idx) => (
        <Chip
          key={`${permission}-${idx}`}
          label={permission}
          size="small"
          variant="outlined"
          sx={{
            borderColor: themeColors?.background,
            color: '#000',
            fontSize: '0.85rem',
            fontWeight: 600,
            height: 32,
          }}
        />
      )),
    [candidate?.permissions, themeColors?.background],
  )

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
        expandIcon={<ExpandMore sx={{ color: themeColors?.background }} />}
        sx={{
          'borderRadius': '8px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
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
              color: themeColors?.background,
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
          label={`${permissionsCount} permission${permissionsCount !== 1 ? 's' : ''}`}
          size="small"
          sx={{
            backgroundColor: themeColors?.background,
            color: '#fff',
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
            No permissions assigned
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  )
})

export default MappingItem
