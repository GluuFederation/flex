import React from 'react'
import { Box, TextField, MenuItem, IconButton, Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import ClearIcon from '@mui/icons-material/Clear'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import type { ScriptListFiltersProps } from '../../types/props'

/**
 * Script list filters component
 */
export function ScriptListFilters({
  filters,
  scriptTypes,
  onFilterChange,
  onClearFilters,
  onRefresh,
  loadingScriptTypes = false,
}: ScriptListFiltersProps): JSX.Element {
  const { t } = useTranslation()

  const handlePatternKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  return (
    <Box
      sx={{
        mb: '10px',
        p: 1,
        backgroundColor: '#fff',
        borderRadius: 1,
        border: '1px solid #e0e0e0',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left side: Filters */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Pattern */}
          <TextField
            size="small"
            placeholder={t('placeholders.search_pattern')}
            name="pattern"
            value={filters.pattern}
            onChange={(e) => onFilterChange({ pattern: e.target.value })}
            onKeyDown={handlePatternKeyDown}
            sx={{ width: '250px' }}
            inputProps={{ 'aria-label': t('placeholders.search_pattern') }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: customColors.lightBlue, pointerEvents: 'none' }}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* Script Type Filter */}
          <TextField
            select
            size="small"
            value={scriptTypes.length > 0 ? filters.type : ''}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            sx={{ width: '220px' }}
            label={t('fields.script_type')}
            disabled={loadingScriptTypes}
          >
            {scriptTypes.map((scriptType) => (
              <MenuItem key={scriptType.value} value={scriptType.value}>
                {scriptType.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Sort By */}
          <TextField
            select
            size="small"
            value={filters.sortBy || 'none'}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value === 'none' ? undefined : (e.target.value as any),
              })
            }
            sx={{ width: '180px' }}
            label={t('fields.sort_by')}
          >
            <MenuItem value="none">{t('options.none')}</MenuItem>
            <MenuItem value="inum">{t('fields.inum')}</MenuItem>
            <MenuItem value="name">{t('fields.name')}</MenuItem>
            <MenuItem value="description">{t('fields.description')}</MenuItem>
          </TextField>

          {/* Sort Order Toggle */}
          {filters.sortBy && filters.sortBy !== 'none' && (
            <IconButton
              size="small"
              onClick={() =>
                onFilterChange({
                  sortOrder: filters.sortOrder === 'ascending' ? 'descending' : 'ascending',
                })
              }
              title={
                filters.sortOrder === 'ascending' ? t('options.ascending') : t('options.descending')
              }
              aria-label={
                filters.sortOrder === 'ascending'
                  ? t('tooltips.sort_descending')
                  : t('tooltips.sort_ascending')
              }
              sx={{ color: customColors.lightBlue }}
            >
              <SwapVertIcon />
            </IconButton>
          )}

          {/* Clear Filters */}
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
            aria-label={t('tooltips.clear_filters')}
            sx={{ color: customColors.lightBlue }}
          >
            {t('actions.clear')}
          </Button>
        </Box>

        {/* Right side: Refresh */}
        <IconButton
          size="small"
          onClick={onRefresh}
          title={t('tooltips.refresh_data')}
          aria-label={t('tooltips.refresh_data')}
          sx={{ color: customColors.lightBlue }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default ScriptListFilters
