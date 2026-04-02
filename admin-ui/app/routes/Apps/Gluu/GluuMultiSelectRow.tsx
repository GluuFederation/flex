import React, { useCallback, useMemo, useRef, useState, useEffect, memo } from 'react'
import { FormGroup, Col } from 'Components'
import { ChevronIcon } from '@/components/SVG'
import GluuLabel from './GluuLabel'
import GluuText from './GluuText'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/GluuMultiSelectRow.style'
import type { GluuMultiSelectRowProps } from './types/GluuMultiSelectRow.types'

const CheckIcon = memo(() => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2 6L5 9L10 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
))
CheckIcon.displayName = 'CheckIcon'

const GluuMultiSelectRow: React.FC<GluuMultiSelectRowProps> = ({
  label,
  name,
  value = [],
  formik,
  options,
  lsize = 3,
  rsize = 9,
  doc_category,
  doc_entry,
  disabled = false,
  required = false,
  showError = false,
  errorMessage,
  isDark: isDarkProp,
  helperText,
  placeholder,
}) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(
    () => getThemeColor(themeState?.theme ?? DEFAULT_THEME),
    [themeState?.theme],
  )
  const isDark = isDarkProp ?? themeState?.theme === THEME_DARK
  const { classes } = useStyles({ themeColors, isDark })

  const [isOpen, setIsOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>(Array.isArray(value) ? value : [])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : [])
  }, [value])

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }, [disabled])

  const handleOptionClick = useCallback(
    (optionValue: string) => {
      if (disabled) return
      let newValues: string[]
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter((v) => v !== optionValue)
      } else {
        const optionOrder = options.map((o) => o.value)
        newValues = [...selectedValues, optionValue].sort(
          (a, b) => optionOrder.indexOf(a) - optionOrder.indexOf(b),
        )
      }
      setSelectedValues(newValues)
      formik.setFieldValue(name, newValues)
    },
    [selectedValues, formik, name, disabled, options],
  )

  const handleRemoveChip = useCallback(
    (e: React.MouseEvent, optionValue: string) => {
      e.stopPropagation()
      if (disabled) return
      const newValues = selectedValues.filter((v) => v !== optionValue)
      setSelectedValues(newValues)
      formik.setFieldValue(name, newValues)
    },
    [selectedValues, formik, name, disabled],
  )

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const getOptionLabel = useCallback(
    (val: string) => {
      const option = options.find((o) => o.value === val)
      return option ? option.label : val
    },
    [options],
  )

  const triggerClasses = [
    classes.selectTrigger,
    isOpen ? classes.selectTriggerOpen : '',
    disabled ? classes.selectTriggerDisabled : '',
  ]
    .filter(Boolean)
    .join(' ')

  const placeholderText = placeholder ?? `${t('actions.choose')}...`

  return (
    <FormGroup row>
      <GluuLabel
        label={label}
        size={lsize}
        doc_category={doc_category}
        doc_entry={doc_entry || name}
        required={required}
        isDark={isDark}
      />
      <Col sm={rsize} className={classes.colWrapper}>
        <div ref={containerRef} style={{ position: 'relative' }}>
          <div
            className={triggerClasses}
            onClick={toggleDropdown}
            onBlur={() => formik.setFieldTouched(name, true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if ((e.target as HTMLElement).closest('button')) return
                e.preventDefault()
                toggleDropdown()
              }
            }}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            tabIndex={disabled ? -1 : 0}
          >
            {selectedValues.length === 0 ? (
              <GluuText variant="span" className={classes.placeholder} disableThemeColor>
                {placeholderText}
              </GluuText>
            ) : (
              selectedValues.map((val, idx) => (
                <GluuText
                  key={`${val}-${idx}`}
                  variant="span"
                  className={classes.chip}
                  disableThemeColor
                >
                  {getOptionLabel(val)}
                  {!disabled && (
                    <button
                      type="button"
                      className={classes.chipRemove}
                      onClick={(e) => handleRemoveChip(e, val)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation()
                        }
                      }}
                      aria-label={`Remove ${getOptionLabel(val)}`}
                    >
                      &times;
                    </button>
                  )}
                </GluuText>
              ))
            )}
            <GluuText
              variant="span"
              className={classes.chevronWrapper}
              disableThemeColor
              aria-hidden
            >
              <ChevronIcon width={20} height={20} direction={isOpen ? 'up' : 'down'} />
            </GluuText>
          </div>

          {isOpen && (
            <div className={classes.dropdownList} role="listbox" aria-multiselectable="true">
              {options.map((option, idx) => {
                const isSelected = selectedValues.includes(option.value)
                return (
                  <div
                    key={`${option.value}-${idx}`}
                    className={`${classes.optionItem} ${isSelected ? classes.optionItemSelected : ''}`}
                    onClick={() => handleOptionClick(option.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleOptionClick(option.value)
                      }
                    }}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                  >
                    <GluuText
                      variant="span"
                      className={`${classes.checkbox} ${isSelected ? classes.checkboxChecked : ''}`}
                      disableThemeColor
                    >
                      <CheckIcon />
                    </GluuText>
                    {option.label}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {showError && errorMessage && (
          <GluuText variant="span" className={classes.error} data-field-error disableThemeColor>
            {errorMessage}
          </GluuText>
        )}
        {helperText && !showError && (
          <GluuText variant="span" className={classes.helperText}>
            {helperText}
          </GluuText>
        )}
      </Col>
    </FormGroup>
  )
}

export default memo(GluuMultiSelectRow)
