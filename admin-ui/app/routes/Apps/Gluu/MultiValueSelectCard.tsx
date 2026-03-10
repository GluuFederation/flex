import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { GluuButton } from '@/components'
import customColors from '@/customColors'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/MultiValueSelectCard.style'
import type { MultiValueSelectCardProps } from './types/MultiValueSelectCard.types'
import { ChevronIcon } from '@/components/SVG'

const MultiValueSelectCard = ({
  label,
  name: _name,
  value,
  options,
  onChange,
  onBlur,
  disabled,
  placeholder,
  allowCustom = false,
  onRemoveField,
  doc_category: _doc_category,
}: MultiValueSelectCardProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)
  const isDark = selectedTheme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const [pendingValue, setPendingValue] = useState('')
  const selectedItems = Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : []
  const availableOptions = options.filter((opt) => !selectedItems.includes(opt))

  const handleAdd = useCallback(() => {
    if (disabled) return
    const trimmed = pendingValue.trim()
    if (!trimmed) return
    if (!allowCustom && !options.includes(trimmed)) return
    if (selectedItems.includes(trimmed)) return
    const next = [...selectedItems, trimmed]
    onChange(next)
    setPendingValue('')
    onBlur?.()
  }, [disabled, allowCustom, options, pendingValue, selectedItems, onChange, onBlur])

  const handleRemove = useCallback(() => {
    if (disabled) return
    if (selectedItems.length === 0) return
    const next = selectedItems.slice(0, -1)
    onChange(next)
    onBlur?.()
  }, [disabled, selectedItems, onChange, onBlur])

  const handleRemoveByName = useCallback(
    (itemName: string) => {
      if (disabled) return
      const next = selectedItems.filter((r) => r !== itemName)
      onChange(next)
      onBlur?.()
    },
    [disabled, selectedItems, onChange, onBlur],
  )

  const content = (
    <div className={classes.card}>
      <div className={classes.header}>{label}:</div>
      <div className={classes.controls}>
        <Autocomplete
          freeSolo={allowCustom}
          disableClearable
          options={availableOptions}
          value={pendingValue || undefined}
          inputValue={allowCustom ? pendingValue : undefined}
          onInputChange={(_event, newInputValue) => {
            if (allowCustom) setPendingValue(newInputValue)
          }}
          onChange={(_event, newValue) => setPendingValue(newValue ? String(newValue) : '')}
          disabled={disabled}
          className={classes.autocomplete}
          popupIcon={<ChevronIcon />}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder ?? t('placeholders.search_here')}
              size="small"
              fullWidth
            />
          )}
        />
        <div className={classes.buttons}>
          <GluuButton
            type="button"
            className={classes.addButton}
            onClick={handleAdd}
            disabled={
              disabled ||
              (allowCustom
                ? !pendingValue.trim()
                : availableOptions.length === 0 || !options.includes(pendingValue.trim()))
            }
            backgroundColor={themeColors.formFooter.apply.backgroundColor}
            textColor={themeColors.formFooter.apply.textColor}
            borderColor={themeColors.formFooter.apply.borderColor}
            useOpacityOnHover
            style={{ gap: 8, minWidth: 92 }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>＋</span> {t('actions.add')}
          </GluuButton>
          <GluuButton
            type="button"
            className={classes.removeButton}
            onClick={handleRemove}
            disabled={disabled || selectedItems.length === 0}
            backgroundColor={customColors.statusInactive}
            textColor={customColors.white}
            borderColor={customColors.statusInactive}
            disableHoverStyles
            style={{ gap: 8, minWidth: 110 }}
          >
            <i className="fa fa-trash" /> {t('actions.remove')}
          </GluuButton>
        </div>
      </div>
      {selectedItems.length > 0 && (
        <div className={classes.tags}>
          {selectedItems.map((r) => (
            <span key={r} className={classes.tag}>
              {r}
              <button
                type="button"
                className={classes.tagRemove}
                onClick={() => handleRemoveByName(r)}
                disabled={disabled}
                aria-disabled={disabled}
                aria-label={`${t('actions.remove')} ${r}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )

  if (onRemoveField) {
    return (
      <div className={classes.wrapper}>
        <div className={classes.cardWrapper}>{content}</div>
        <button
          type="button"
          className={classes.removeFieldButton}
          onClick={onRemoveField}
          aria-label={t('actions.remove')}
        >
          <i className="fa fa-fw fa-close" style={{ color: themeColors.fontColor }} />
        </button>
      </div>
    )
  }

  return content
}

export default MultiValueSelectCard
