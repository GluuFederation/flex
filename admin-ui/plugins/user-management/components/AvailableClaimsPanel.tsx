import React, { useMemo, useCallback } from 'react'
import { debounce } from 'lodash'
import { PersonAttribute } from '../types/UserApiTypes'
import { USER_PASSWORD_ATTR } from '../common/Constants'
import { Dispatch } from '@reduxjs/toolkit'
import { GetAttributesParams } from 'JansConfigApi'
import { getAttributesRoot } from 'Redux/features/attributesSlice'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './AvailableClaimsPanel.style'

const USED_CLAIMS = new Set([
  'userId',
  'displayName',
  'mail',
  'status',
  USER_PASSWORD_ATTR,
  'givenName',
  'middleName',
  'sn',
])

interface AvailableClaimsPanelProps {
  searchClaims: string
  setSearchClaims: (value: string) => void
  personAttributes: PersonAttribute[]
  selectedClaims: PersonAttribute[]
  setSelectedClaimsToState: (data: PersonAttribute) => void
  dispatch?: Dispatch
  options?: Partial<GetAttributesParams>
  setSearchPattern?: (pattern: string | undefined) => void
}

const AvailableClaimsPanel = ({
  searchClaims,
  setSearchClaims,
  personAttributes,
  selectedClaims,
  setSelectedClaimsToState,
  dispatch,
  options,
  setSearchPattern,
}: AvailableClaimsPanelProps) => {
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ themeColors, isDark })

  // Support both patterns: direct dispatch or callback
  const debouncedSetPattern = useMemo(
    () =>
      setSearchPattern
        ? debounce((value: string) => {
            setSearchPattern(value || undefined)
          }, 500)
        : null,
    [setSearchPattern],
  )

  const debouncedDispatch = useMemo(
    () =>
      dispatch && options
        ? debounce((value: string) => {
            const updatedOptions = { ...options, pattern: value }
            dispatch(getAttributesRoot({ options: updatedOptions }))
          }, 500)
        : null,
    [dispatch, options],
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchClaims(value)

      if (debouncedSetPattern) {
        debouncedSetPattern(value)
      } else if (debouncedDispatch) {
        debouncedDispatch(value)
      }
    },
    [setSearchClaims, debouncedSetPattern, debouncedDispatch],
  )

  return (
    <div className={classes.root}>
      <div className={classes.header}>Available Claims</div>
      <div className={classes.content}>
        <input
          type="search"
          id="availableClaimsSearch"
          name="availableClaimsSearch"
          className={`form-control ${classes.search}`}
          placeholder="Search Claims Here"
          onChange={(e) => {
            handleSearchChange(e.target.value)
          }}
          value={searchClaims}
        />
        <ul className={classes.list}>
          {personAttributes.map((data: PersonAttribute, key: number) => {
            const name = data.displayName?.toLowerCase() || ''
            const alreadyAddedClaim = selectedClaims.some(
              (el: PersonAttribute) => el.name === data.name,
            )
            if (
              data.status &&
              data.status.toLowerCase() === 'active' &&
              !USED_CLAIMS.has(data.name)
            ) {
              if (
                (name.includes(searchClaims.toLowerCase()) || searchClaims === '') &&
                !alreadyAddedClaim
              ) {
                return (
                  <li
                    className={classes.listItem}
                    key={'list' + key}
                    title="Click to add to the form"
                  >
                    <button
                      type="button"
                      className={classes.itemButton}
                      onClick={() => setSelectedClaimsToState(data)}
                    >
                      {data.displayName}
                    </button>
                  </li>
                )
              }
            }
            return null
          })}
        </ul>
      </div>
    </div>
  )
}

export default React.memo(AvailableClaimsPanel)
