import React, { useState, useEffect, useMemo } from 'react'
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  TextField,
  Box
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { applyFilter } from 'Plugins/auth-server/redux/features/scopeSlice'

const ScopeFilter = ({
  tableColumns,
  visibleColumns,
  toggleFilter,
  themeColors,
  handleOptionsChange,
  setPageNumber
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const appliedFilterKey = useSelector(
    state => state.scopeReducer.appliedFilterKey
  )
  const appliedFilterValue = useSelector(
    state => state.scopeReducer.appliedFilterValue
  )

  const [selectedFilter, setSelectedFilter] = useState(appliedFilterKey)
  const [filterValue, setFilterValue] = useState(appliedFilterValue)

  useEffect(() => {
    setSelectedFilter(appliedFilterKey)
    setFilterValue(appliedFilterValue)
  }, [appliedFilterKey, appliedFilterValue])

  const availableFilteredColumns = useMemo(
    () =>
      tableColumns.filter(
        col => col.field !== 'dn' && visibleColumns.includes(col.field)
      ),
    [tableColumns, visibleColumns]
  )

  // Handlers
  const handleFilterChange = event => {
    setSelectedFilter(event.target.value)
  }

  const handleValueChange = event => {
    setFilterValue(event.target.value)
  }

  const handleApplyClick = () => {
    dispatch(applyFilter({ key: selectedFilter, value: filterValue }))
    setPageNumber(0) // Reset to first page when applying filter
    handleOptionsChange(selectedFilter, filterValue)
  }

  const handleCloseClick = () => {
    toggleFilter()
  }

  return (
    <Box display="flex" alignItems="center" gap={1} width="100%">
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel
          id="filter-dropdown-label"
          sx={{
            '&.Mui-focused': {
              color: themeColors.background
            }
          }}
        >
          {t('placeholders.searchFilter')}
        </InputLabel>
        <Select
          labelId="filter-dropdown-label"
          value={selectedFilter}
          label={t('placeholders.searchFilter')}
          onChange={handleFilterChange}
          sx={{
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: themeColors.background
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: `${themeColors.background}55`
            },
            '& .Mui-selected': {
              backgroundColor: `${themeColors.background}33`
            },
            '& .Mui-selected:hover': {
              backgroundColor: `${themeColors.background}55`
            },
            '& .MuiSelect-icon': {
              color: 'inherit'
            }
          }}
        >
          <MenuItem value="">None</MenuItem>
          {availableFilteredColumns.map(col => (
            <MenuItem key={col.field} value={col.field}>
              {col.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label={t('placeholders.valueKey')}
        value={filterValue}
        onChange={handleValueChange}
        sx={{
          '& label.Mui-focused': {
            color: themeColors.background
          },

          '& .MuiOutlinedInput-root': {
            '&:hover': {
              color: themeColors.background
            },

            '&:hover fieldset': {
              borderColor: `${themeColors.background}55`
            },

            '&.Mui-focused fieldset': {
              borderColor: themeColors.background
            },

            '& .MuiSvgIcon-root': {
              color: themeColors.background
            }
          }
        }}
      />

      <Button
        variant="contained"
        disabled={!selectedFilter}
        onClick={handleApplyClick}
        sx={{
          backgroundColor: themeColors.background,
          '&:hover': {
            backgroundColor: themeColors.background
          }
        }}
      >
        {t('actions.apply')}
      </Button>

      <Button
        variant="outlined"
        onClick={handleCloseClick}
        sx={{
          color: themeColors.background,
          borderColor: themeColors.background,
          '&:hover': {
            borderColor: themeColors.background
          }
        }}
      >
        {t('actions.close')}
      </Button>
    </Box>
  )
}

export default ScopeFilter
