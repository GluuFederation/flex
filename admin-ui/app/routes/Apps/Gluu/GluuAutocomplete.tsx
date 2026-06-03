import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Close as CloseIcon, HelpOutline } from '@/components/icons'
import { ChevronIcon } from '@/components/SVG'
import GluuTooltip from './GluuTooltip'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { useStyles } from './styles/GluuAutocomplete.style'
import GluuText from './GluuText'
import type { ModifierArguments, Obj } from '@popperjs/core'
import type { GluuAutocompleteProps } from './types/GluuAutocomplete.types'

const NEW_SELECTION_PREFIX = 'new-selection:'

const sameWidthModifier = ({ state }: ModifierArguments<Obj>): void => {
  const w = `${state.rects.reference.width}px`
  state.elements.popper.style.setProperty('width', w)
  state.elements.popper.style.setProperty('min-width', w)
}

const GluuAutocomplete = ({
  label,
  name: _name,
  value,
  options,
  onChange,
  onBlur,
  disabled = false,
  placeholder,
  allowCustom = false,
  onSearch,
  isLoading = false,
  onRemoveField,
  doc_category,
  doc_entry,
  surfaceColor,
  contrastOptionHover,
  withWrapper = true,
  hideLabel = false,
  required = false,
  showError = false,
  errorMessage,
  helperText,
  hideHelperWhenSelected = false,
  compactSelectionSpacing = false,
}: GluuAutocompleteProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)
  const { classes } = useStyles({
    themeColors,
    allowCustom,
    surfaceColor,
    contrastOptionHover,
    withWrapper,
    compactSelectionSpacing,
  })

  const resolvedHelperText = helperText ?? t('messages.multi_select_hint')

  const optionValues = React.useMemo(
    () => options.map((o) => (typeof o === 'string' ? o : o.value)),
    [options],
  )
  const labelByValue = React.useMemo(() => {
    const map: Record<string, string> = {}
    for (const o of options) {
      if (typeof o !== 'string') map[o.value] = o.label
    }
    return map
  }, [options])
  const getDisplayLabel = useCallback(
    (val: string) =>
      val.startsWith(NEW_SELECTION_PREFIX)
        ? val.slice(NEW_SELECTION_PREFIX.length)
        : (labelByValue[val] ?? val),
    [labelByValue],
  )

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
    },
    [onChange],
  )

  const filterOptions = useCallback(
    (opts: string[], state: { inputValue: string }) => {
      const query = state.inputValue.trim().toLowerCase()
      const filtered = opts.filter(
        (o) => getDisplayLabel(o).toLowerCase().includes(query) && !selectedItems.includes(o),
      )
      if (
        allowCustom &&
        query &&
        !opts.some((o) => getDisplayLabel(o).toLowerCase() === query) &&
        !selectedItems.some((s) => getDisplayLabel(s).toLowerCase() === query)
      ) {
        filtered.push(`${NEW_SELECTION_PREFIX}${state.inputValue.trim()}`)
      }
      return filtered
    },
    [allowCustom, selectedItems, getDisplayLabel],
  )

  const content = (
    <div className={withWrapper ? classes.card : classes.plain}>
      {!hideLabel && (
        <div className={classes.header}>
          {label}:{required && <span className={classes.requiredMark}>*</span>}
          {doc_category && doc_entry && (
            <>
              <GluuTooltip
                tooltipOnly
                doc_entry={doc_entry}
                doc_category={doc_category}
                place="right"
              />
              <HelpOutline
                tabIndex={-1}
                style={{ width: 18, height: 18, marginLeft: 4, color: themeColors.fontColor }}
                data-tooltip-id={doc_entry}
                data-for={doc_entry}
              />
            </>
          )}
        </div>
      )}
      <div className={classes.controls}>
        <div className={classes.autocompleteWrapper}>
          <Autocomplete
            multiple
            loading={isLoading}
            loadingText={`${t('messages.loading')}...`}
            noOptionsText={t('messages.no_data_available')}
            clearText={t('actions.clear')}
            closeText={t('actions.close')}
            openText={t('actions.choose')}
            openOnFocus
            inputValue={inputValue}
            onInputChange={(_e, val, reason) => {
              if (reason !== 'reset') {
                setInputValue(val)
                onSearch?.(val)
              }
            }}
            options={
              allowCustom
                ? [...optionValues, ...selectedItems.filter((s) => !optionValues.includes(s))]
                : optionValues
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
            getOptionLabel={(option) => getDisplayLabel(option)}
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
                  getDisplayLabel(option)
                )}
              </li>
            )}
            renderInput={(params) => {
              const { slotProps: paramsSlotProps, ...restParams } = params
              const paramsInputProps = paramsSlotProps.htmlInput
              const paramsInputComponentProps = paramsSlotProps.input
              return (
                <TextField
                  {...restParams}
                  placeholder={placeholder ?? t('placeholders.search_here')}
                  size="small"
                  fullWidth
                  slotProps={{
                    htmlInput: {
                      ...paramsInputProps,
                      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (allowCustom && e.key === 'Enter') {
                          const trimmed = inputValue.trim()
                          if (
                            trimmed &&
                            !optionValues.some((o) =>
                              getDisplayLabel(o).toLowerCase().includes(trimmed.toLowerCase()),
                            ) &&
                            !selectedItems.some(
                              (s) => getDisplayLabel(s).toLowerCase() === trimmed.toLowerCase(),
                            )
                          ) {
                            e.preventDefault()
                            onChange([...selectedItems, trimmed])
                            setInputValue('')
                            e.currentTarget.blur()
                            return
                          }
                        }
                        paramsInputProps?.onKeyDown?.(e)
                      },
                      style: {
                        ...(paramsInputProps?.style as React.CSSProperties),
                        outline: 'none',
                        outlineWidth: 0,
                        outlineOffset: 0,
                        boxShadow: 'none',
                        border: 'none',
                      },
                    },
                    input: {
                      ...paramsInputComponentProps,
                      endAdornment: (
                        <>
                          {inputValue && (
                            <button
                              type="button"
                              onClick={() => setInputValue('')}
                              className={classes.endIconButton}
                              aria-label={t('actions.clear')}
                            >
                              <CloseIcon sx={{ fontSize: 16 }} />
                            </button>
                          )}
                          {paramsInputComponentProps?.endAdornment}
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
                    },
                  }}
                />
              )
            }}
            renderValue={() => null}
          />
        </div>
      </div>
      {resolvedHelperText &&
        !showError &&
        !(hideHelperWhenSelected && selectedItems.length > 0) && (
          <GluuText disableThemeColor className={classes.helperText}>
            {resolvedHelperText}
          </GluuText>
        )}
      {selectedItems.length > 0 && (
        <div className={classes.tags}>
          {selectedItems.map((item) => (
            <span key={item} className={classes.tag} title={getDisplayLabel(item)}>
              <GluuText disableThemeColor className={classes.tagLabel}>
                {getDisplayLabel(item)}
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
                <CloseIcon sx={{ fontSize: 14 }} />
              </button>
            </span>
          ))}
        </div>
      )}
      {showError && errorMessage && (
        <GluuText disableThemeColor className={classes.error}>
          {errorMessage}
        </GluuText>
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
          <CloseIcon sx={{ fontSize: 16, color: themeColors.fontColor }} />
        </button>
      </div>
    )
  }

  return content
}

export default GluuAutocomplete
