import { useState, useCallback } from 'react'
import type { ScriptListFilters } from '../types/domain'

/**
 * Default filter values
 */
const DEFAULT_FILTERS: ScriptListFilters = {
  pattern: '',
  type: 'person_authentication',
  sortBy: undefined,
  sortOrder: 'ascending',
}

/**
 * Hook for managing script list filters
 * @param initialType - Optional initial script type
 * @returns Filter state and handlers
 */
export function useScriptFilters(initialType?: string) {
  const [filters, setFilters] = useState<ScriptListFilters>({
    ...DEFAULT_FILTERS,
    type: initialType || DEFAULT_FILTERS.type,
  })

  /**
   * Update a single filter value
   */
  const updateFilter = useCallback(
    <K extends keyof ScriptListFilters>(key: K, value: ScriptListFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  /**
   * Update multiple filters at once
   */
  const updateFilters = useCallback((updates: Partial<ScriptListFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }, [])

  /**
   * Update search pattern
   */
  const updatePattern = useCallback((pattern: string) => {
    setFilters((prev) => ({ ...prev, pattern }))
  }, [])

  /**
   * Update script type filter
   */
  const updateType = useCallback((type: string) => {
    setFilters((prev) => ({ ...prev, type }))
  }, [])

  /**
   * Update sort field
   */
  const updateSortBy = useCallback((sortBy: ScriptListFilters['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }, [])

  /**
   * Toggle sort order
   */
  const toggleSortOrder = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'ascending' ? 'descending' : 'ascending',
    }))
  }, [])

  /**
   * Update sort order
   */
  const updateSortOrder = useCallback((sortOrder: 'ascending' | 'descending') => {
    setFilters((prev) => ({ ...prev, sortOrder }))
  }, [])

  /**
   * Clear all filters to defaults
   */
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  /**
   * Reset to default filters but keep the current type
   */
  const resetFiltersKeepType = useCallback(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      type: prev.type,
    }))
  }, [])

  return {
    filters,
    updateFilter,
    updateFilters,
    updatePattern,
    updateType,
    updateSortBy,
    updateSortOrder,
    toggleSortOrder,
    clearFilters,
    resetFiltersKeepType,
  }
}
