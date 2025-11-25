import React, { useMemo, useCallback } from 'react'
import { debounce } from 'lodash'
import { PersonAttribute } from '../types/UserApiTypes'
import { USER_PASSWORD_ATTR } from '../common/Constants'
import { Dispatch } from '@reduxjs/toolkit'
import { GetAttributesParams } from 'JansConfigApi'
import { getAttributesRoot } from 'Redux/features/attributesSlice'

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
    <div className="border border-light d-flex flex-column h-100" style={{ minHeight: 0 }}>
      <div className="bg-light text-bold p-2">Available Claims</div>
      <input
        type="search"
        id="availableClaimsSearch"
        name="availableClaimsSearch"
        className="form-control mb-2"
        placeholder="Search Claims Here "
        onChange={(e) => {
          handleSearchChange(e.target.value)
        }}
        value={searchClaims}
      />
      <ul className="list-group flex-grow-1 overflow-auto mb-0" style={{ minHeight: 0 }}>
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
                <li className="list-group-item" key={'list' + key} title="Click to add to the form">
                  <button
                    type="button"
                    className="btn btn-link p-0 text-start"
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
  )
}

export default React.memo(AvailableClaimsPanel)
