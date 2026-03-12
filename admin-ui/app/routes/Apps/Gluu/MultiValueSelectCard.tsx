import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { GluuButton } from '@/components'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
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
  const { classes } = useStyles({ themeColors })

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

  const handleRemoveByName = useCallback(
    (itemName: string) => {
      if (disabled) return
      const next = selectedItems.filter((r) => r !== itemName)
      onChange(next)
      onBlur?.()
    },
    [disabled, selectedItems, onChange, onBlur],
  )

  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPendingValue(e.target.value)
  }, [])

  const content = (
    <div className={classes.card}>
      <div className={classes.header}>{label}:</div>
      <div className={classes.controls}>
        <div className={classes.selectWrapper}>
          <select
            value={pendingValue}
            onChange={handleSelectChange}
            disabled={disabled}
            className={classes.select}
          >
            <option value="">{placeholder ?? t('placeholders.search_here')}</option>
            {availableOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className={classes.chevronWrapper} aria-hidden>
            <ChevronIcon width={20} height={20} direction="down" />
          </span>
        </div>
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
        >
          <i className="fa fa-fw fa-plus" /> {t('actions.add')}
        </GluuButton>
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
