import React, { useMemo, useCallback } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuButton } from '@/components/GluuButton'
import GluuText from '@/routes/Apps/Gluu/GluuText'
import GluuRefreshButton from './GluuRefreshButton'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import {
  DATE_FORMATS,
  createDate,
  subtractDate,
  isValidDate,
  isAfterDate,
} from '@/utils/dayjsUtils'
import type { Dayjs } from '@/utils/dayjsUtils'
import { useStyles, DEFAULT_INPUT_HEIGHT } from './GluuSearchToolbar.style'
import type { GluuSearchToolbarProps } from './types'

const DEFAULT_LAYOUT = 'row' as const

function useDateRangeValidation(startDate: Dayjs | null, endDate: Dayjs | null) {
  return useMemo(() => {
    const startValid = startDate != null && isValidDate(startDate)
    const endValid = endDate != null && isValidDate(endDate)
    const hasBoth = startValid && endValid
    const hasOnlyOne = (startValid && !endValid) || (!startValid && endValid)
    const isStartAfterEnd = hasBoth && isAfterDate(startDate!, endDate!)
    const invalid = !hasBoth || isStartAfterEnd
    return { hasBoth, hasOnlyOne, isStartAfterEnd, invalid }
  }, [startDate, endDate])
}

const GluuSearchToolbar: React.FC<GluuSearchToolbarProps> = (props) => {
  const {
    searchPlaceholder = 'Search Pattern',
    searchLabel,
    searchValue = '',
    onSearch,
    onSearchSubmit,
    filters,
    dateInputs,
    dateRange,
    dateRangeSlot,
    onRefresh,
    primaryAction,
    refreshLoading = false,
    refreshButtonVariant = 'outlined',
  } = props

  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useStyles({ themeColors, isDark })

  const dateValidation = useDateRangeValidation(
    dateRange?.startDate ?? null,
    dateRange?.endDate ?? null,
  )

  const showBuiltInDateRange = dateRange != null
  const defaultDates = useMemo(
    () => ({
      start: subtractDate(createDate(), 14, 'day'),
      end: createDate(),
    }),
    [],
  )
  const primaryDisabled = showBuiltInDateRange
    ? dateValidation.invalid
    : (primaryAction?.disabled ?? false)
  const refreshDisabled = showBuiltInDateRange ? dateValidation.invalid : false

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearchSubmit) {
        onSearchSubmit(searchValue)
      }
    },
    [onSearchSubmit, searchValue],
  )

  const primaryButtonColors = useMemo(
    () => ({
      backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
      textColor: themeColors.formFooter?.apply?.textColor,
    }),
    [themeColors],
  )

  const iconSx = useMemo(() => ({ fontSize: 20 }), [])

  return (
    <div className={classes.container}>
      <div className={classes.fieldGroupSearch}>
        {searchLabel && (
          <GluuText variant="span" className={classes.fieldLabel} disableThemeColor>
            {searchLabel}
          </GluuText>
        )}
        <div className={classes.searchWrapper}>
          <span className={classes.searchIcon}>
            <SearchIcon sx={iconSx} />
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            onKeyDown={handleKeyDown}
            className={classes.searchInput}
            aria-label={searchLabel ?? searchPlaceholder ?? 'search'}
          />
        </div>
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
            <select
              id={filterId}
              className={classes.filterSelect}
              style={{ width: filter.width ?? 160 }}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
              style={{ width: dateInput.width ?? 255 }}
              value={dateInput.value}
              onChange={(e) => dateInput.onChange(e.target.value)}
              max={dateInput.max}
              min={dateInput.min}
            />
          </div>
        )
      })}

      {showBuiltInDateRange ? (
        <div className={classes.dateRangeSlot}>
          <GluuDatePicker
            mode="range"
            layout={dateRange.layout ?? DEFAULT_LAYOUT}
            labelAsTitle={dateRange.labelAsTitle ?? true}
            inputHeight={dateRange.inputHeight ?? DEFAULT_INPUT_HEIGHT}
            dateFormat={dateRange.dateFormat ?? DATE_FORMATS.DATE_PICKER_DISPLAY}
            startDate={dateRange.startDate ?? defaultDates.start}
            endDate={dateRange.endDate ?? defaultDates.end}
            onStartDateChange={dateRange.onStartDateChange}
            onEndDateChange={dateRange.onEndDateChange}
            onStartDateAccept={dateRange.onStartDateAccept}
            onEndDateAccept={dateRange.onEndDateAccept}
            textColor={themeColors.fontColor}
            backgroundColor={themeColors.settings?.cardBackground ?? themeColors.card.background}
          />
        </div>
      ) : (
        dateRangeSlot && <div className={classes.dateRangeSlot}>{dateRangeSlot}</div>
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
            onClick={primaryAction.onClick}
            size="md"
            minHeight={DEFAULT_INPUT_HEIGHT}
            backgroundColor={primaryButtonColors.backgroundColor}
            textColor={primaryButtonColors.textColor}
            borderColor={primaryButtonColors.backgroundColor}
            useOpacityOnHover
          >
            {primaryAction.icon ?? <SearchIcon sx={iconSx} />}
            {primaryAction.label}
          </GluuButton>
        )}
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
