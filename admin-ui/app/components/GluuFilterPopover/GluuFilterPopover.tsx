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

  const applyButtonColors = useMemo(
    () => ({
      backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
      textColor: themeColors.formFooter?.apply?.textColor,
    }),
    [themeColors],
  )

  useEffect(() => {
    if (!open) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (!popoverRef.current) return
      const target = event.target as Node
      if (popoverRef.current.contains(target)) return
      // MUI date pickers render their calendar in a portal outside the popover DOM —
      // don't close when clicking inside that portal
      const muiPopper = document.querySelector('.MuiPickersPopper-root')
      if (muiPopper?.contains(target)) return
      onCancel()
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [open, onCancel])

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
