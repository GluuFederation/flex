import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuButton } from '@/components/GluuButton'
import { ChevronIcon } from '@/components/SVG'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import { DATE_FORMATS } from '@/utils/dayjsUtils'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import GluuText from '@/routes/Apps/Gluu/GluuText'
import useMediaQuery from '@mui/material/useMediaQuery'
import { FILTER_SHEET, MOBILE_MEDIA_QUERY, OPACITY } from '@/constants'
import MobileNavSheet from '@/components/MobileBottomNav/MobileNavSheet'
import { SHEET_KEYS } from '@/components/MobileBottomNav/sheetConstants'
import { useStyles } from './GluuFilterPopover.style'
import type { GluuFilterPopoverProps, FilterField } from './types'

const FilterFieldRenderer: React.FC<{
  field: FilterField
  classes: ReturnType<typeof useStyles>['classes']
}> = ({ field, classes }) => {
  const fieldType = field.type ?? (field.options ? 'select' : 'text')

  if (fieldType === 'date' && field.onDateChange) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <GluuDatePicker
          dateFormat={DATE_FORMATS.DATE_PICKER_DISPLAY_US}
          label=""
          value={field.dateValue ?? null}
          onChange={field.onDateChange}
          minDate={field.minDate}
          inputHeight={52}
        />
      </LocalizationProvider>
    )
  }

  if (fieldType === 'select' && field.options) {
    return (
      <div className={classes.selectWrapper}>
        <select
          className={classes.select}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={classes.selectChevron}>
          <ChevronIcon width={20} height={20} direction="down" />
        </span>
      </div>
    )
  }

  return (
    <input
      type="text"
      className={classes.textInput}
      placeholder={field.placeholder ?? ''}
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
    />
  )
}

const GluuFilterPopover: React.FC<GluuFilterPopoverProps> = ({
  open,
  fields,
  onApply,
  onCancel,
  applyLabel,
  cancelLabel,
  columns = 2,
  width,
  className,
  children,
  applyDisabled,
}) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useStyles({ themeColors, isDark, width, columns })
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  const applyButtonColors = useMemo(
    () => ({
      backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
      textColor: themeColors.formFooter?.apply?.textColor,
    }),
    [themeColors],
  )

  const sheetCancelColors = useMemo(
    () => ({
      textColor: themeColors.formFooter?.cancel?.textColor ?? themeColors.fontColor,
      borderColor: themeColors.formFooter?.cancel?.borderColor ?? themeColors.borderColor,
    }),
    [themeColors],
  )

  const sheetApplyColors = useMemo(
    () => ({
      backgroundColor: themeColors.badges?.filledBadgeBg ?? themeColors.fontColor,
      textColor: themeColors.badges?.filledBadgeText ?? themeColors.background,
    }),
    [themeColors],
  )

  useEffect(() => {
    if (!open || isMobile) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (!popoverRef.current) return
      const target = event.target as Node
      if (popoverRef.current.contains(target)) return
      const muiPopper = document.querySelector('.MuiPickerPopper-root, .MuiPickersPopper-root')
      if (muiPopper?.contains(target)) return
      onCancel()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !applyDisabled) {
        onApply()
      } else if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, isMobile, onCancel, onApply, applyDisabled])

  if (isMobile) {
    return (
      <MobileNavSheet
        openKey={open ? SHEET_KEYS.CUSTOM : null}
        onClose={onCancel}
        title={t('titles.filters')}
      >
        <div className={classes.sheetContent}>
          {fields.map((field) => (
            <div key={field.key} className={classes.sheetFieldGroup}>
              {field.label && (
                <GluuText variant="span" disableThemeColor className={classes.sheetFieldLabel}>
                  {field.label}
                </GluuText>
              )}
              <FilterFieldRenderer field={field} classes={classes} />
            </div>
          ))}

          {children}

          <div className={classes.sheetButtonRow}>
            <GluuButton
              type="button"
              size="md"
              block
              outlined
              onClick={onCancel}
              textColor={sheetCancelColors.textColor}
              borderColor={sheetCancelColors.borderColor}
              borderRadius={FILTER_SHEET.BUTTON_RADIUS}
              minHeight={FILTER_SHEET.BUTTON_HEIGHT}
              fontWeight={700}
            >
              {cancelLabel ?? t('actions.cancel')}
            </GluuButton>
            <GluuButton
              type="button"
              size="md"
              block
              onClick={onApply}
              disabled={applyDisabled}
              backgroundColor={sheetApplyColors.backgroundColor}
              textColor={sheetApplyColors.textColor}
              borderColor={sheetApplyColors.backgroundColor}
              borderRadius={FILTER_SHEET.BUTTON_RADIUS}
              minHeight={FILTER_SHEET.BUTTON_HEIGHT}
              fontWeight={700}
              useOpacityOnHover
              hoverOpacity={OPACITY.OVERLAY}
            >
              {applyLabel ?? t('actions.apply')}
            </GluuButton>
          </div>
        </div>
      </MobileNavSheet>
    )
  }

  if (!open) return null

  return (
    <div ref={popoverRef} className={`${classes.container}${className ? ` ${className}` : ''}`}>
      <div className={classes.fieldsGrid}>
        {fields.map((field) => (
          <div
            key={field.key}
            className={field.fullWidth ? classes.fieldGroupFull : classes.fieldGroup}
          >
            {field.label && (
              <GluuText variant="span" disableThemeColor className={classes.fieldLabel}>
                {field.label}
              </GluuText>
            )}
            <FilterFieldRenderer field={field} classes={classes} />
          </div>
        ))}
      </div>

      {children}

      <div className={classes.buttonRow}>
        <GluuButton
          type="button"
          size="md"
          block
          onClick={onApply}
          disabled={applyDisabled}
          backgroundColor={applyButtonColors.backgroundColor}
          textColor={applyButtonColors.textColor}
          borderColor={applyButtonColors.backgroundColor}
          fontWeight={600}
          minHeight={48}
          useOpacityOnHover
        >
          {applyLabel ?? t('actions.apply_filter')}
        </GluuButton>
        <GluuButton
          type="button"
          size="md"
          block
          outlined
          onClick={onCancel}
          textColor={themeColors.fontColor}
          borderColor={themeColors.fontColor}
          fontWeight={600}
          minHeight={48}
          useOpacityOnHover
        >
          {cancelLabel ?? t('actions.cancel')}
        </GluuButton>
      </div>
    </div>
  )
}

export default React.memo(GluuFilterPopover)
