import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { ChevronIcon } from '@/components/SVG'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/UserRoleAutocomplete.style'
import GluuText from './GluuText'
import type { ModifierArguments, Obj } from '@popperjs/core'
import type { UserRoleAutocompleteProps } from './types/UserRoleAutocomplete.types'

const NEW_SELECTION_PREFIX = 'new-selection:'

const sameWidthModifier = ({ state }: ModifierArguments<Obj>): void => {
  const w = `${state.rects.reference.width}px`
  state.elements.popper.style.setProperty('width', w)
  state.elements.popper.style.setProperty('min-width', w)
}

const UserRoleAutocomplete = ({
  label,
  name: _name,
  value,
  options,
  onChange,
  onBlur,
  disabled = false,
  placeholder,
  allowCustom = false,
  onRemoveField,
  doc_category: _doc_category,
  inputBackgroundColor,
  withWrapper = true,
  required = false,
  showError = false,
  errorMessage,
  helperText,
}: UserRoleAutocompleteProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)
  const isDark = selectedTheme === THEME_DARK
  const { classes } = useStyles({
    themeColors,
    allowCustom,
    isDark,
    inputBackgroundColor,
    withWrapper,
  })

  const selectedItems = Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : []

  const [inputValue, setInputValue] = React.useState('')

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: string[], reason: string) => {
      if (reason === 'removeOption') return
      const normalized = newValue
        .map((v) =>
          typeof v === 'string' && v.startsWith(NEW_SELECTION_PREFIX)
            ? v.slice(NEW_SELECTION_PREFIX.length)
            : v,
        )
        .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
      onChange(normalized)
      setInputValue('')
      onBlur?.()
    },
    [onChange, onBlur],
  )

  const filterOptions = useCallback(
    (opts: string[], state: { inputValue: string }) => {
      const query = state.inputValue.trim().toLowerCase()
      const filtered = opts.filter(
        (o) => o.toLowerCase().includes(query) && !selectedItems.includes(o),
      )
      if (
        allowCustom &&
        query &&
        !opts.some((o) => o.toLowerCase() === query) &&
        !selectedItems.some((s) => s.toLowerCase() === query)
      ) {
        filtered.push(`${NEW_SELECTION_PREFIX}${state.inputValue.trim()}`)
      }
      return filtered
    },
    [allowCustom, selectedItems],
  )

  const content = (
    <div className={withWrapper ? classes.card : classes.plain}>
      <div className={classes.header}>
        {label}:{required && <span className={classes.requiredMark}>*</span>}
      </div>
      <div className={classes.controls}>
        <div className={classes.autocompleteWrapper}>
          <Autocomplete
            multiple
            inputValue={inputValue}
            onInputChange={(_e, val, reason) => {
              if (reason !== 'reset') setInputValue(val)
            }}
            options={
              allowCustom
                ? [...options, ...selectedItems.filter((s) => !options.includes(s))]
                : options
            }
            value={selectedItems}
            isOptionEqualToValue={(option, val) => option === val}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            disableClearable
            disablePortal
            className={classes.autocompleteRoot}
            slotProps={{
              paper: {
                className: classes.dropdownPaper,
                sx: {
                  border: 'none',
                  boxShadow: 'none',
                  width: '100%',
                  minWidth: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                },
              },
              popper: {
                modifiers: [
                  {
                    name: 'sameWidth',
                    enabled: true,
                    phase: 'afterWrite' as const,
                    fn: sameWidthModifier,
                  },
                ],
              },
            }}
            forcePopupIcon
            popupIcon={<ChevronIcon width={20} height={20} direction="down" />}
            filterOptions={filterOptions}
            getOptionLabel={(option) =>
              typeof option === 'string' && option.startsWith(NEW_SELECTION_PREFIX)
                ? option.slice(NEW_SELECTION_PREFIX.length)
                : option
            }
            renderOption={(props, option) => (
              <li
                {...props}
                key={option}
                style={{
                  ...props.style,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {typeof option === 'string' && option.startsWith(NEW_SELECTION_PREFIX) ? (
                  <>
                    <GluuText disableThemeColor className={classes.newSelectionPrefix}>
                      {t('placeholders.new_selection')}:&nbsp;
                    </GluuText>
                    <GluuText disableThemeColor className={classes.newSelectionValue}>
                      {option.slice(NEW_SELECTION_PREFIX.length)}
                    </GluuText>
                  </>
                ) : (
                  option
                )}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder ?? t('placeholders.search_here')}
                size="small"
                fullWidth
                inputProps={{
                  ...params.inputProps,
                  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (allowCustom && e.key === 'Enter') {
                      const trimmed = inputValue.trim()
                      if (
                        trimmed &&
                        !options.some((o) => o.toLowerCase().includes(trimmed.toLowerCase())) &&
                        !selectedItems.some((s) => s.toLowerCase() === trimmed.toLowerCase())
                      ) {
                        e.preventDefault()
                        onChange([...selectedItems, trimmed])
                        setInputValue('')
                        e.currentTarget.blur()
                        return
                      }
                    }
                    params.inputProps.onKeyDown?.(e)
                  },
                  style: {
                    ...(params.inputProps?.style as React.CSSProperties),
                    outline: 'none',
                    outlineWidth: 0,
                    outlineOffset: 0,
                    boxShadow: 'none',
                    border: 'none',
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {inputValue && (
                        <button
                          type="button"
                          onClick={() => setInputValue('')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            color: themeColors.fontColor,
                          }}
                          aria-label={t('actions.clear')}
                        >
                          <i className="fa fa-fw fa-close" style={{ fontSize: 16 }} />
                        </button>
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                  sx: {
                    'outline': 'none',
                    'boxShadow': 'none',
                    '&.Mui-focused, &.Mui-focusVisible': {
                      outline: 'none !important',
                      boxShadow: 'none !important',
                    },
                    '& .MuiOutlinedInput-input': {
                      'outline': 'none !important',
                      'boxShadow': 'none !important',
                      'border': 'none !important',
                      '&:focus, &:focus-visible': {
                        outline: 'none !important',
                        boxShadow: 'none !important',
                        border: 'none !important',
                      },
                    },
                  },
                }}
              />
            )}
            renderTags={() => null}
          />
        </div>
      </div>
      {selectedItems.length > 0 && (
        <div className={classes.tags}>
          {selectedItems.map((item) => (
            <span key={item} className={classes.tag} title={item}>
              <GluuText disableThemeColor className={classes.tagLabel}>
                {item}
              </GluuText>
              <button
                type="button"
                className={classes.tagRemove}
                onClick={() => {
                  const next = selectedItems.filter((x) => x !== item)
                  onChange(next)
                  onBlur?.()
                }}
                aria-label={t('actions.remove')}
              >
                <i className="fa fa-fw fa-close" />
              </button>
            </span>
          ))}
        </div>
      )}
      {showError && errorMessage ? (
        <GluuText disableThemeColor className={classes.error}>
          {errorMessage}
        </GluuText>
      ) : helperText ? (
        <GluuText disableThemeColor className={classes.helperText}>
          {helperText}
        </GluuText>
      ) : null}
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

export default UserRoleAutocomplete
