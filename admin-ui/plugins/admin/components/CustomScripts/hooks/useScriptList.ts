import { useState, useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetConfigScriptsByType,
  useGetCustomScriptType,
  useDeleteConfigScriptsByInum,
  getGetConfigScriptsByTypeQueryKey,
} from 'JansConfigApi'
import type { CustomScript, ScriptTypeOption, ScriptListFilters } from '../types/domain'
import { formatScriptTypeName, DEFAULT_PAGE_SIZE } from '../constants'

/**
 * Hook for managing script list
 * @param filters - Current filter state
 * @param initialPageSize - Initial page size (default: 10)
 * @returns List state and handlers
 */
export function useScriptList(filters: ScriptListFilters, initialPageSize = DEFAULT_PAGE_SIZE) {
  const queryClient = useQueryClient()

  // Pagination state
  const [pageNumber, setPageNumber] = useState(0)
  const [limit, setLimit] = useState(initialPageSize)
  const [startIndex, setStartIndex] = useState(0)

  // Fetch scripts by type
  const {
    data: scriptsResponse,
    isLoading: loading,
    error: scriptsError,
  } = useGetConfigScriptsByType(filters.type || 'person_authentication', {
    limit,
    pattern: filters.pattern.trim() || undefined,
    startIndex,
    sortBy: filters.sortBy || undefined,
    sortOrder: filters.sortBy ? filters.sortOrder : undefined,
  })

  // Fetch script types
  const { data: scriptTypesData, isLoading: loadingScriptTypes } = useGetCustomScriptType()

  // Transform data
  const scripts = useMemo(
    () => (scriptsResponse?.entries || []) as CustomScript[],
    [scriptsResponse],
  )
  const totalItems = scriptsResponse?.totalEntriesCount || 0

  const scriptTypes: ScriptTypeOption[] = useMemo(
    () =>
      (scriptTypesData || []).map((type) => ({
        value: type,
        name: formatScriptTypeName(type),
      })),
    [scriptTypesData],
  )

  // Delete mutation
  const deleteScript = useDeleteConfigScriptsByInum()

  /**
   * Handle page change
   */
  const handlePageChange = useCallback(
    (page: number) => {
      const newStartIndex = page * limit
      setStartIndex(newStartIndex)
      setPageNumber(page)
    },
    [limit],
  )

  /**
   * Handle rows per page change
   */
  const handleRowsPerPageChange = useCallback((count: number) => {
    setPageNumber(0)
    setStartIndex(0)
    setLimit(count)
  }, [])

  /**
   * Reset pagination (when filters change)
   */
  const resetPagination = useCallback(() => {
    setPageNumber(0)
    setStartIndex(0)
  }, [])

  /**
   * Refresh current data
   */
  const refresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: getGetConfigScriptsByTypeQueryKey(filters.type || 'person_authentication'),
    })
  }, [queryClient, filters.type])

  /**
   * Delete a script
   */
  const handleDelete = useCallback(
    async (inum: string) => {
      await deleteScript.mutateAsync({ inum })

      queryClient.invalidateQueries({
        queryKey: getGetConfigScriptsByTypeQueryKey(filters.type || 'person_authentication'),
      })
    },
    [deleteScript, queryClient, filters.type],
  )

  return {
    scripts,
    totalItems,
    scriptTypes,

    // Loading states
    loading,
    loadingScriptTypes,
    deleting: deleteScript.isPending,

    // Errors
    error: scriptsError,
    deleteError: deleteScript.error,

    // Pagination
    pageNumber,
    limit,
    startIndex,
    handlePageChange,
    handleRowsPerPageChange,
    resetPagination,

    // Actions
    refresh,
    handleDelete,
  }
}
