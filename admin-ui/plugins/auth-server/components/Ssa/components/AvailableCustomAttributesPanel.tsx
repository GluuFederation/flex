import React, { useDeferredValue, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Close } from '@/components/icons'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/AvailableCustomAttributesPanel.style'
import type { CustomAttributesPanelProps } from '../types'

const AvailableCustomAttributesPanel: React.FC<CustomAttributesPanelProps> = ({
  availableAttributes,
  selectedAttributes,
  onAttributeSelect,
  searchInputValue,
  onSearchChange,
}) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ themeColors, isDark })
  const deferredSearchInputValue = useDeferredValue(searchInputValue)

  const normalizedAttributes = useMemo(
    () =>
      availableAttributes.map((attribute) => ({
        label: attribute,
        normalized: attribute.toLowerCase(),
      })),
    [availableAttributes],
  )

  const selectedAttributeSet = useMemo(() => new Set(selectedAttributes), [selectedAttributes])

  const visibleOptions = useMemo(() => {
    const searchTrimmed = deferredSearchInputValue.trim()
    const searchLower = searchTrimmed.toLowerCase()
    return normalizedAttributes
      .filter(({ label, normalized }) => {
        const alreadyAdded = selectedAttributeSet.has(label)
        if (alreadyAdded) return false
        if (searchLower === '') return true
        return normalized.includes(searchLower)
      })
      .map(({ label }) => label)
  }, [deferredSearchInputValue, normalizedAttributes, selectedAttributeSet])

  const showNoDataState =
    availableAttributes.length === 0 ||
    (deferredSearchInputValue.trim() !== '' && visibleOptions.length === 0)

  return (
    <div className={classes.root}>
      <GluuText variant="h3" className={classes.header}>
        {t('menus.available_custom_attributes')}
      </GluuText>
      <div className={classes.divider} aria-hidden="true" />
      <div className={classes.content}>
        <div className={classes.searchWrapper}>
          <input
            type="text"
            id="availableAttributesSearch"
            name="availableAttributesSearch"
            className={`form-control ${classes.search}`}
            placeholder={t('placeholders.search_attribute_here')}
            aria-label={t('placeholders.search_attribute_here')}
            autoComplete="off"
            onChange={(e) => onSearchChange(e.target.value)}
            value={searchInputValue}
          />
          {searchInputValue && (
            <button
              type="button"
              className={classes.searchClearButton}
              onClick={() => onSearchChange('')}
              aria-label={t('actions.clear_search')}
            >
              <Close fontSize="small" />
            </button>
          )}
        </div>
        {visibleOptions.length > 0 ? (
          <ul className={classes.list} aria-label={t('menus.available_custom_attributes')}>
            {visibleOptions.map((attribute) => (
              <li className={classes.listItem} key={attribute}>
                <button
                  type="button"
                  className={classes.itemButton}
                  onClick={() => onAttributeSelect(attribute)}
                  title={t('tooltips.click_to_add')}
                  aria-label={`${t('actions.add')} ${attribute}`}
                >
                  {attribute}
                </button>
              </li>
            ))}
          </ul>
        ) : showNoDataState ? (
          <div className={classes.emptyState}>
            <GluuText disableThemeColor className={classes.emptyStateText}>
              {t('messages.no_data_found')}
            </GluuText>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default React.memo(AvailableCustomAttributesPanel)
