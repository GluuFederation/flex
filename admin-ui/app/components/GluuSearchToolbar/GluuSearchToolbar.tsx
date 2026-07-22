import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { FilterListIcon, RefreshIcon, SearchIcon, SegmentIcon } from '@/components/icons'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuButton } from '@/components/GluuButton'
import { ChevronIcon } from '@/components/SVG'
import GluuText from '@/routes/Apps/Gluu/GluuText'
import GluuRefreshButton from './GluuRefreshButton'
import MobileNavSheet from '@/components/MobileBottomNav/MobileNavSheet'
import { SHEET_KEYS } from '@/components/MobileBottomNav/sheetConstants'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import { FILTER_SHEET, MOBILE_MEDIA_QUERY, OPACITY } from '@/constants'
import {
  DATE_FORMATS,
  createDate,
  subtractDate,
  isValidDate,
  isAfterDate,
} from '@/utils/dayjsUtils'
import type { Dayjs } from '@/utils/dayjsUtils'
import { useDebounce } from '@/utils/hooks/useDebounce'
import { useStyles, DEFAULT_INPUT_HEIGHT } from './GluuSearchToolbar.style'
import type { FilterDef, GluuSearchToolbarProps } from './types'

const DEFAULT_LAYOUT = 'row' as const

const useDateRangeValidation = (startDate: Dayjs | null, endDate: Dayjs | null) =>
  useMemo(() => {
    const startValid = startDate != null && isValidDate(startDate)
    const endValid = endDate != null && isValidDate(endDate)
    const hasBoth = startValid && endValid
    const hasOnlyOne = (startValid && !endValid) || (!startValid && endValid)
    const isStartAfterEnd = hasBoth && isAfterDate(startDate!, endDate!)
    const invalid = !hasBoth || isStartAfterEnd
    return { hasBoth, hasOnlyOne, isStartAfterEnd, invalid }
  }, [startDate, endDate])

const PLACEHOLDER_KEY = 'placeholders.search_pattern'

const DEFAULT_DATES = {
  start: subtractDate(createDate(), 14, 'day'),
  end: createDate(),
}

const GluuSearchToolbar: React.FC<GluuSearchToolbarProps> = (props) => {
  const {
    searchPlaceholder,
    searchLabel,
    searchValue = '',
    searchFieldWidth,
    searchOnType = false,
    searchDebounceMs = 500,
    onSearch,
    onSearchSubmit,
    selectOptions,
    onSelectChange,
    selectPlaceholder,
    filters,
    dateInputs,
    dateRange,
    dateRangeSlot,
    onRefresh,
    primaryAction,
    actionsLabel,
    refreshLoading = false,
    refreshButtonVariant = 'outlined',
    disabled = false,
  } = props

  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes, cx } = useStyles({ themeColors, isDark, searchFieldWidth })

  const effectivePlaceholder =
    searchPlaceholder ?? t(PLACEHOLDER_KEY, { defaultValue: 'Search pattern' })

  const [localSearch, setLocalSearch] = useState(searchValue)
  const lastNotifiedRef = useRef(searchValue)
  const debouncedSearch = useDebounce(localSearch, searchDebounceMs)

  useEffect(() => {
    if (searchValue !== lastNotifiedRef.current) {
      lastNotifiedRef.current = searchValue
      setLocalSearch(searchValue)
      return
    }
    if (searchOnType && debouncedSearch !== lastNotifiedRef.current) {
      lastNotifiedRef.current = debouncedSearch
      onSearch?.(debouncedSearch)
    }
  }, [searchOnType, debouncedSearch, onSearch, searchValue])

  const dateValidation = useDateRangeValidation(
    dateRange?.startDate ?? null,
    dateRange?.endDate ?? null,
  )

  const showBuiltInDateRange = dateRange != null
  const primaryDisabled = showBuiltInDateRange
    ? dateValidation.invalid
    : (primaryAction?.disabled ?? false)
  const refreshDisabled = showBuiltInDateRange ? dateValidation.invalid : false

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        lastNotifiedRef.current = localSearch
        onSearch?.(localSearch)
        onSearchSubmit?.(localSearch)
      }
    },
    [onSearch, onSearchSubmit, localSearch],
  )

  const handlePrimaryClick = useCallback(() => {
    if (primaryAction?.onClick) {
      primaryAction.onClick()
    } else {
      lastNotifiedRef.current = localSearch
      onSearch?.(localSearch)
      onSearchSubmit?.(localSearch)
    }
  }, [primaryAction, localSearch, onSearch, onSearchSubmit])

  const primaryButtonColors = useMemo(
    () => ({
      backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
      textColor: themeColors.formFooter?.apply?.textColor,
    }),
    [themeColors],
  )

  const sheetAccent = useMemo(
    () => ({
      backgroundColor: themeColors.badges?.filledBadgeBg ?? themeColors.fontColor,
      textColor: themeColors.badges?.filledBadgeText ?? themeColors.background,
    }),
    [themeColors],
  )

  const sheetCancel = useMemo(
    () => ({
      textColor: themeColors.formFooter?.cancel?.textColor ?? themeColors.fontColor,
      borderColor: themeColors.formFooter?.cancel?.borderColor ?? themeColors.borderColor,
    }),
    [themeColors],
  )

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)
  const hasFilters = (filters?.length ?? 0) > 0
  const hasDateRange = showBuiltInDateRange
  const showSheetFilters = hasFilters || hasDateRange
  const directRefresh = !showSheetFilters && !primaryAction && !!onRefresh
  const showTrigger = showSheetFilters || !!primaryAction || !!onRefresh
  const useCompactMobile = isMobile && !selectOptions && !dateInputs?.length && !dateRangeSlot
  const [sheetOpen, setSheetOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState<Record<string, string>>({})

  const openSheet = useCallback(() => {
    if (filters?.length) {
      setDraftFilters(Object.fromEntries(filters.map((f) => [f.key, f.value])))
    }
    setSheetOpen(true)
  }, [filters])
  const closeSheet = useCallback(() => setSheetOpen(false), [])
  const commitFilters = useCallback(
    (resolveValue: (filter: FilterDef) => string | undefined) => {
      filters?.forEach((f) => {
        const next = resolveValue(f)
        if (next !== undefined && next !== f.value) f.onChange(next)
      })
      setSheetOpen(false)
    },
    [filters],
  )
  const cancelSheet = useCallback(() => {
    commitFilters((f) => f.defaultValue)
  }, [commitFilters])
  const applySheet = useCallback(() => {
    if (showBuiltInDateRange && dateValidation.invalid) return
    commitFilters((f) => draftFilters[f.key])
    if (showBuiltInDateRange) {
      onSearch?.(localSearch)
      onSearchSubmit?.(localSearch)
    }
  }, [
    commitFilters,
    draftFilters,
    showBuiltInDateRange,
    dateValidation.invalid,
    onSearch,
    onSearchSubmit,
    localSearch,
  ])
  const handleSheetAction = useCallback((action?: () => void) => {
    setSheetOpen(false)
    action?.()
  }, [])

  const dateRangePicker = showBuiltInDateRange ? (
    <GluuDatePicker
      mode="range"
      layout={isMobile ? 'grid' : (dateRange.layout ?? DEFAULT_LAYOUT)}
      forceIcon={isMobile}
      labelAsTitle={dateRange.labelAsTitle ?? true}
      inputHeight={dateRange.inputHeight ?? DEFAULT_INPUT_HEIGHT}
      dateFormat={dateRange.dateFormat ?? DATE_FORMATS.DATE_PICKER_DISPLAY}
      startDate={dateRange.startDate ?? DEFAULT_DATES.start}
      endDate={dateRange.endDate ?? DEFAULT_DATES.end}
      onStartDateChange={dateRange.onStartDateChange}
      onEndDateChange={dateRange.onEndDateChange}
      onStartDateAccept={dateRange.onStartDateAccept}
      onEndDateAccept={dateRange.onEndDateAccept}
      showTime={dateRange.showTime}
      textColor={themeColors.fontColor}
      backgroundColor={themeColors.settings?.cardBackground ?? themeColors.card?.background}
    />
  ) : null

  if (useCompactMobile) {
    return (
      <div className={classes.container}>
        <div className={classes.mobileRow}>
          <input
            type="text"
            aria-label={effectivePlaceholder}
            placeholder={effectivePlaceholder}
            value={localSearch}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={classes.mobileInput}
          />
          {showTrigger && (
            <button
              type="button"
              aria-label={
                showSheetFilters
                  ? t('titles.filters')
                  : directRefresh
                    ? t('actions.refresh')
                    : t('fields.actions')
              }
              aria-haspopup={directRefresh ? undefined : 'dialog'}
              aria-expanded={directRefresh ? undefined : sheetOpen}
              className={classes.mobileTrigger}
              onClick={directRefresh ? onRefresh : openSheet}
              disabled={disabled}
            >
              {showSheetFilters ? (
                <FilterListIcon />
              ) : directRefresh ? (
                <RefreshIcon />
              ) : (
                <SegmentIcon />
              )}
            </button>
          )}
        </div>
        {!directRefresh && (
          <MobileNavSheet
            openKey={sheetOpen ? SHEET_KEYS.CUSTOM : null}
            onClose={closeSheet}
            title={showSheetFilters ? t('titles.filters') : t('fields.actions')}
          >
            <div className={classes.sheetContent}>
              {dateRangePicker && <div className={classes.sheetGroup}>{dateRangePicker}</div>}
              {filters?.map((filter) => (
                <div key={filter.key} className={classes.sheetGroup}>
                  <span className={classes.sheetLabel}>{filter.label}</span>
                  <div className={classes.sheetPills} role="group" aria-label={filter.label}>
                    {filter.options.map((option) => {
                      const selected = draftFilters[filter.key] === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={selected}
                          className={cx(classes.sheetPill, selected && classes.sheetPillSelected)}
                          onClick={() =>
                            setDraftFilters((prev) => ({ ...prev, [filter.key]: option.value }))
                          }
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              {!showSheetFilters && (onRefresh || primaryAction) && (
                <div className={classes.sheetActions}>
                  {onRefresh && (
                    <GluuButton
                      type="button"
                      size="md"
                      block
                      outlined
                      onClick={() => handleSheetAction(onRefresh)}
                      borderColor={themeColors.borderColor}
                      borderRadius={FILTER_SHEET.BUTTON_RADIUS}
                      minHeight={FILTER_SHEET.BUTTON_HEIGHT}
                      fontWeight={700}
                    >
                      <RefreshIcon className={classes.sheetButtonIcon} />
                      {t('actions.refresh')}
                    </GluuButton>
                  )}
                  {primaryAction && (
                    <GluuButton
                      type="button"
                      size="md"
                      block
                      disabled={primaryDisabled}
                      onClick={() => handleSheetAction(primaryAction.onClick)}
                      backgroundColor={sheetAccent.backgroundColor}
                      borderColor={sheetAccent.backgroundColor}
                      textColor={sheetAccent.textColor}
                      borderRadius={FILTER_SHEET.BUTTON_RADIUS}
                      minHeight={FILTER_SHEET.BUTTON_HEIGHT}
                      fontWeight={700}
                      useOpacityOnHover
                      hoverOpacity={OPACITY.OVERLAY}
                    >
                      {primaryAction.icon}
                      {primaryAction.label}
                    </GluuButton>
                  )}
                </div>
              )}
              {showBuiltInDateRange &&
                (dateValidation.isStartAfterEnd || dateValidation.hasOnlyOne) && (
                  <div className={classes.validationRow}>
                    {dateValidation.isStartAfterEnd && (
                      <GluuText
                        variant="span"
                        disableThemeColor
                        className={classes.validationError}
                      >
                        {t('messages.start_date_after_end')}
                      </GluuText>
                    )}
                    {dateValidation.hasOnlyOne && (
                      <GluuText
                        variant="span"
                        disableThemeColor
                        className={classes.validationWarning}
                      >
                        {t('messages.both_dates_required')}
                      </GluuText>
                    )}
                  </div>
                )}
              {showSheetFilters && (
                <div className={classes.sheetButtonRow}>
                  <GluuButton
                    type="button"
                    size="md"
                    block
                    outlined
                    onClick={cancelSheet}
                    textColor={sheetCancel.textColor}
                    borderColor={sheetCancel.borderColor}
                    borderRadius={FILTER_SHEET.BUTTON_RADIUS}
                    minHeight={FILTER_SHEET.BUTTON_HEIGHT}
                    fontWeight={700}
                  >
                    {t('actions.cancel')}
                  </GluuButton>
                  <GluuButton
                    type="button"
                    size="md"
                    block
                    disabled={showBuiltInDateRange && dateValidation.invalid}
                    onClick={applySheet}
                    backgroundColor={sheetAccent.backgroundColor}
                    borderColor={sheetAccent.backgroundColor}
                    textColor={sheetAccent.textColor}
                    borderRadius={FILTER_SHEET.BUTTON_RADIUS}
                    minHeight={FILTER_SHEET.BUTTON_HEIGHT}
                    fontWeight={700}
                    useOpacityOnHover
                    hoverOpacity={OPACITY.OVERLAY}
                  >
                    {t('actions.apply')}
                  </GluuButton>
                </div>
              )}
            </div>
          </MobileNavSheet>
        )}
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <div className={classes.fieldGroupSearch}>
        {searchLabel && (
          <GluuText variant="span" className={classes.fieldLabel} disableThemeColor>
            {searchLabel}
          </GluuText>
        )}
        {selectOptions ? (
          <div className={classes.filterSelectWrapper}>
            <select
              className={classes.filterSelect}
              value={searchValue}
              onChange={(e) => onSelectChange?.(e.target.value)}
              disabled={disabled}
              aria-label={searchLabel ?? effectivePlaceholder ?? 'select'}
            >
              {selectPlaceholder && (
                <option value="" disabled hidden>
                  {selectPlaceholder}
                </option>
              )}
              {selectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className={classes.filterSelectChevron}>
              <ChevronIcon width={20} height={20} direction="down" />
            </span>
          </div>
        ) : (
          <div className={classes.searchWrapper}>
            <span className={classes.searchIcon}>
              <SearchIcon className={classes.searchIconSvg} />
            </span>
            <input
              type="text"
              placeholder={effectivePlaceholder}
              value={localSearch}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className={cx(classes.searchInput, disabled && classes.searchInputDisabled)}
              aria-label={searchLabel ?? effectivePlaceholder ?? 'search'}
            />
          </div>
        )}
      </div>

      {filters?.map((filter) => {
        const filterId = `${filter.key}-select`
        return (
          <div key={filter.key} className={classes.fieldGroup}>
            {filter.label && (
              <label htmlFor={filterId} className={classes.fieldLabel}>
                {filter.label}
              </label>
            )}
            <div
              className={classes.filterSelectWrapper}
              style={filter.width ? { width: filter.width } : undefined}
            >
              <select
                id={filterId}
                className={classes.filterSelect}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className={classes.filterSelectChevron}>
                <ChevronIcon width={20} height={20} direction="down" />
              </span>
            </div>
          </div>
        )
      })}

      {dateInputs?.map((dateInput) => {
        const dateInputId = `${dateInput.key}-date`
        return (
          <div key={dateInput.key} className={classes.fieldGroup}>
            {dateInput.label && (
              <label htmlFor={dateInputId} className={classes.fieldLabel}>
                {dateInput.label}
              </label>
            )}
            <input
              id={dateInputId}
              type="date"
              className={classes.dateInput}
              style={dateInput.width ? { width: dateInput.width } : undefined}
              value={dateInput.value}
              onChange={(e) => dateInput.onChange(e.target.value)}
              max={dateInput.max}
              min={dateInput.min}
            />
          </div>
        )
      })}

      {dateRangePicker ? (
        <div className={classes.dateRangeSlot}>{dateRangePicker}</div>
      ) : (
        dateRangeSlot && <div className={classes.dateRangeSlot}>{dateRangeSlot}</div>
      )}

      <div className={classes.actionsGroup}>
        {actionsLabel && (onRefresh || primaryAction) && (
          <GluuText variant="span" className={classes.fieldLabel} disableThemeColor>
            {actionsLabel}
          </GluuText>
        )}
        <div className={classes.buttonGroup}>
          {onRefresh && (
            <GluuRefreshButton
              className={classes.toolbarButton}
              onClick={onRefresh}
              loading={refreshLoading}
              variant={refreshButtonVariant}
              minHeight={DEFAULT_INPUT_HEIGHT}
              disabled={refreshDisabled}
            />
          )}

          {primaryAction && (
            <GluuButton
              type="button"
              className={classes.toolbarButton}
              disabled={primaryDisabled}
              onClick={handlePrimaryClick}
              size="md"
              minHeight={DEFAULT_INPUT_HEIGHT}
              backgroundColor={primaryButtonColors.backgroundColor}
              textColor={primaryButtonColors.textColor}
              borderColor={primaryButtonColors.backgroundColor}
              useOpacityOnHover
            >
              {primaryAction.icon ?? <SearchIcon className={classes.searchIconSvg} />}
              {primaryAction.label}
            </GluuButton>
          )}
        </div>
      </div>

      {showBuiltInDateRange && (dateValidation.isStartAfterEnd || dateValidation.hasOnlyOne) && (
        <div className={classes.validationRow}>
          {dateValidation.isStartAfterEnd && (
            <GluuText variant="span" disableThemeColor className={classes.validationError}>
              {t('messages.start_date_after_end')}
            </GluuText>
          )}
          {dateValidation.hasOnlyOne && (
            <GluuText variant="span" disableThemeColor className={classes.validationWarning}>
              {t('messages.both_dates_required')}
            </GluuText>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(GluuSearchToolbar)
