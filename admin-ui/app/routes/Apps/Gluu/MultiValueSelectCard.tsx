import React, { useState, useCallback } from 'react'
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
  placeholder = 'Search Here',
  allowCustom = false,
  onRemoveField,
  doc_category: _doc_category,
}: MultiValueSelectCardProps) => {
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
    const trimmed = pendingValue.trim()
    if (!trimmed) return
    if (selectedItems.includes(trimmed)) return
    const next = [...selectedItems, trimmed]
    onChange(next)
    setPendingValue('')
    onBlur?.()
  }, [pendingValue, selectedItems, onChange, onBlur])

  const handleRemove = useCallback(() => {
    if (selectedItems.length === 0) return
    const next = selectedItems.slice(0, -1)
    onChange(next)
    onBlur?.()
  }, [selectedItems, onChange, onBlur])

  const handleRemoveByName = useCallback(
    (itemName: string) => {
      const next = selectedItems.filter((r) => r !== itemName)
      onChange(next)
      onBlur?.()
    },
    [selectedItems, onChange, onBlur],
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
          inputValue={pendingValue}
          onInputChange={(_event, newInputValue) => setPendingValue(newInputValue)}
          onChange={(_event, newValue) => setPendingValue(newValue ? String(newValue) : '')}
          disabled={disabled}
          className={classes.autocomplete}
          popupIcon={<ChevronIcon />}
          renderInput={(params) => (
            <TextField {...params} placeholder={placeholder} size="small" fullWidth />
          )}
        />
        <div className={classes.buttons}>
          <GluuButton
            type="button"
            className={classes.addButton}
            onClick={handleAdd}
            disabled={allowCustom ? !pendingValue.trim() : availableOptions.length === 0}
            backgroundColor={themeColors.formFooter.apply.backgroundColor}
            textColor={themeColors.formFooter.apply.textColor}
            borderColor={themeColors.formFooter.apply.borderColor}
            useOpacityOnHover
            style={{ gap: 8, minWidth: 92 }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>＋</span> Add
          </GluuButton>
          <GluuButton
            type="button"
            className={classes.removeButton}
            onClick={handleRemove}
            disabled={selectedItems.length === 0}
            backgroundColor={customColors.statusInactive}
            textColor={customColors.white}
            borderColor={customColors.statusInactive}
            disableHoverStyles
            style={{ gap: 8, minWidth: 110 }}
          >
            <i className="fa fa-trash" /> Remove
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
                aria-label={`Remove ${r}`}
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
        <div
          className={classes.removeFieldButton}
          onClick={onRemoveField}
          onKeyDown={(e) => e.key === 'Enter' && onRemoveField()}
          role="button"
          tabIndex={0}
          aria-label="Remove field"
        >
          <i className="fa fa-fw fa-close" style={{ color: themeColors.fontColor }} />
        </div>
      </div>
    )
  }

  return content
}

export default MultiValueSelectCard
