import React, { useMemo, useCallback } from 'react'
import { getClaimLabel } from '../utils/claimLabelUtils'
import { useTranslation } from 'react-i18next'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import type { PersonAttribute, AvailableClaimsPanelProps } from '../types'
import { USER_PASSWORD_ATTR } from '../common'
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
  'createdAt',
  'updatedAt',
])

const AvailableClaimsPanel = ({
  searchClaims,
  setSearchClaims,
  personAttributes,
  selectedClaims,
  setSelectedClaimsToState,
}: AvailableClaimsPanelProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ themeColors, isDark })

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchClaims(value)
    },
    [setSearchClaims],
  )

  const visibleOptions = useMemo(() => {
    const searchTrimmed = searchClaims.trim()
    if (searchTrimmed === '') return []
    const searchLower = searchTrimmed.toLowerCase()
    return personAttributes.filter((data: PersonAttribute) => {
      const label = getClaimLabel(t, data.name, data.displayName).toLowerCase()
      const alreadyAddedClaim = selectedClaims.some((el: PersonAttribute) => el.name === data.name)
      const isActive = data.status?.toLowerCase() === 'active'
      const notUsed = !USED_CLAIMS.has(data.name)
      const matchesSearch = label.includes(searchLower)
      return Boolean(isActive && notUsed && matchesSearch && !alreadyAddedClaim)
    })
  }, [personAttributes, searchClaims, selectedClaims, t])

  return (
    <div className={classes.root}>
      <GluuText variant="h3" className={classes.header}>
        {t('menus.available_claims')}
      </GluuText>
      <div className={classes.divider} aria-hidden="true" />
      <div className={classes.content}>
        <div className={classes.searchWrapper}>
          <input
            type="text"
            id="availableClaimsSearch"
            name="availableClaimsSearch"
            className={`form-control ${classes.search}`}
            placeholder={t('placeholders.search_claims_here')}
            aria-label={t('placeholders.search_claims_here')}
            autoComplete="off"
            onChange={(e) => {
              handleSearchChange(e.target.value)
            }}
            value={searchClaims}
          />
          {searchClaims && (
            <button
              type="button"
              className={classes.searchClearButton}
              onClick={() => handleSearchChange('')}
              aria-label={t('actions.clear_search')}
            >
              <i className="fa fa-fw fa-close" />
            </button>
          )}
        </div>
        {visibleOptions.length > 0 ? (
          <ul className={classes.list}>
            {visibleOptions.map((data: PersonAttribute) => (
              <li className={classes.listItem} key={data.name}>
                <button
                  type="button"
                  className={classes.itemButton}
                  onClick={() => setSelectedClaimsToState(data)}
                >
                  {getClaimLabel(t, data.name, data.displayName)}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default React.memo(AvailableClaimsPanel)
