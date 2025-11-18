import React, { useMemo } from 'react'
import { debounce } from 'lodash'
import { AvailableClaimsPanelProps } from '../types/UserFormTypes'
import { PersonAttribute } from '../types/UserApiTypes'
import { USER_PASSWORD_ATTR } from '../common/Constants'

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

const AvailableClaimsPanel = ({
  searchClaims,
  setSearchClaims,
  personAttributes,
  selectedClaims,
  setSelectedClaimsToState,
  setSearchPattern,
}: AvailableClaimsPanelProps) => {
  const debouncedSetPattern = useMemo(
    () =>
      debounce((value: string) => {
        setSearchPattern(value || undefined)
      }, 500),
    [setSearchPattern],
  )

  return (
    <div className="border border-light ">
      <div className="bg-light text-bold p-2">Available Claims</div>
      <input
        type="search"
        className="form-control mb-2"
        placeholder="Search Claims Here "
        onChange={(e) => {
          setSearchClaims(e.target.value)
          debouncedSetPattern(e.target.value)
        }}
        value={searchClaims}
      />
      <ul className="list-group">
        {personAttributes.map((data: PersonAttribute, key: number) => {
          const alreadyAddedClaim = selectedClaims.some(
            (el: PersonAttribute) => el.name === data.name,
          )
          if (
            data.status &&
            data.status.toLowerCase() === 'active' &&
            !USED_CLAIMS.has(data.name)
          ) {
            if (!alreadyAddedClaim) {
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
        })}
      </ul>
    </div>
  )
}

export default AvailableClaimsPanel
