import React, { memo, useCallback, useState, useEffect, KeyboardEvent } from 'react'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  InputAdornment,
  Tooltip,
  SelectChangeEvent,
} from '@mui/material'
import { Search, ArrowUpward, ArrowDownward } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export type WebhookSortBy = 'displayName' | 'url' | 'httpMethod' | 'jansEnabled'

interface WebhookSearchProps {
  pattern: string
  sortBy: WebhookSortBy
  sortOrder: 'ascending' | 'descending'
  limit: number
  onPatternChange: (pattern: string) => void
  onSortByChange: (sortBy: WebhookSortBy) => void
  onSortOrderChange: (sortOrder: 'ascending' | 'descending') => void
  onLimitChange: (limit: number) => void
}

const SORT_BY_OPTIONS: { value: WebhookSortBy; labelKey: string }[] = [
  { value: 'displayName', labelKey: 'fields.name' },
  { value: 'url', labelKey: 'fields.url' },
  { value: 'httpMethod', labelKey: 'fields.http_method' },
  { value: 'jansEnabled', labelKey: 'fields.status' },
]

const LIMIT_OPTIONS = [5, 10, 25, 50]

const WebhookSearch: React.FC<WebhookSearchProps> = ({
  pattern,
  sortBy,
  sortOrder,
  limit,
  onPatternChange,
  onSortByChange,
  onSortOrderChange,
  onLimitChange,
}) => {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(pattern)

  // Keep input in sync if pattern is reset externally (e.g., from URL/query params)
  useEffect(() => {
    setInputValue(pattern)
  }, [pattern])

  const handlePatternKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onPatternChange(inputValue)
      }
    },
    [inputValue, onPatternChange],
  )

  const handleSortByChange = useCallback(
    (event: SelectChangeEvent<WebhookSortBy>) => {
      onSortByChange(event.target.value)
    },
    [onSortByChange],
  )

  const handleSortOrderToggle = useCallback(() => {
    onSortOrderChange(sortOrder === 'ascending' ? 'descending' : 'ascending')
  }, [sortOrder, onSortOrderChange])

  const handleLimitChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      onLimitChange(Number(event.target.value))
    },
    [onLimitChange],
  )

  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
      <TextField
        size="small"
        placeholder={t('placeholders.search_pattern', { defaultValue: 'Search...' })}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handlePatternKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 200 }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="sort-by-label">{t('fields.sort_by')}</InputLabel>
        <Select
          labelId="sort-by-label"
          value={sortBy}
          label={t('fields.sort_by')}
          onChange={handleSortByChange}
        >
          {SORT_BY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {t(option.labelKey)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip
        title={
          sortOrder === 'ascending'
            ? t('options.ascending', { defaultValue: 'Ascending' })
            : t('options.descending', { defaultValue: 'Descending' })
        }
      >
        <IconButton onClick={handleSortOrderToggle} size="small" color="primary">
          {sortOrder === 'ascending' ? <ArrowUpward /> : <ArrowDownward />}
        </IconButton>
      </Tooltip>

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel id="limit-label">{t('fields.results_per_page')}</InputLabel>
        <Select
          labelId="limit-label"
          value={limit}
          label={t('fields.results_per_page')}
          onChange={handleLimitChange}
        >
          {LIMIT_OPTIONS.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default memo(WebhookSearch)
