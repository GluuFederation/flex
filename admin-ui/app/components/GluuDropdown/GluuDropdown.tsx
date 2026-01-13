import React, { useState, useRef, useEffect, useContext, useMemo, useCallback, memo } from 'react'
import Box from '@mui/material/Box'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'
import { useStyles } from './GluuDropdown.style'
import type { DropdownValue, GluuDropdownOption, GluuDropdownProps, DropdownState } from './types'

const ArrowIcon = memo(() => (
  <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 10L0 0H15L7.5 10Z" fill="currentColor" stroke="none" />
  </svg>
))
ArrowIcon.displayName = 'ArrowIcon'

export function GluuDropdown<T extends DropdownValue = DropdownValue>({
  trigger,
  options,
  position = 'bottom',
  selectedValue,
  onSelect,
  onOpenChange,
  className,
  dropdownClassName,
  minWidth,
  maxWidth,
  maxHeight,
  showArrow = true,
  closeOnSelect = true,
  closeOnOutsideClick = true,
  disabled = false,
  controlled = false,
  isOpen: controlledIsOpen,
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options available',
  multiple = false,
  renderOption,
  renderTrigger,
}: GluuDropdownProps<T>): React.ReactElement {
  const [internalState, setInternalState] = useState<DropdownState>({
    isOpen: false,
    searchQuery: '',
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state.theme || 'light'
  const isDark = currentTheme === 'dark'
  const dropdownBg = useMemo(() => {
    return isDark ? customColors.darkDropdownBg : customColors.white
  }, [isDark])
  const { classes } = useStyles({ isDark, position, dropdownBg })

  const isOpen = controlled ? (controlledIsOpen ?? false) : internalState.isOpen
  const searchQuery = internalState.searchQuery

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!controlled) {
        setInternalState((prev) => ({ ...prev, isOpen: open }))
      }
      onOpenChange?.(open)
    },
    [controlled, onOpenChange],
  )

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return options
    }

    const query = searchQuery.toLowerCase().trim()
    return options.filter((option) => {
      if (option.divider) return true
      const labelText = typeof option.label === 'string' ? option.label : ''
      return labelText.toLowerCase().includes(query)
    })
  }, [options, searchQuery, searchable])

  const isSelected = useCallback(
    (value: T): boolean => {
      if (selectedValue === undefined) return false
      if (multiple && Array.isArray(selectedValue)) {
        return selectedValue.includes(value)
      }
      return selectedValue === value
    },
    [selectedValue, multiple],
  )

  const getSelectedOption = useCallback((): GluuDropdownOption<T> | undefined => {
    if (selectedValue === undefined) return undefined
    if (multiple && Array.isArray(selectedValue)) {
      return options.find((opt) => selectedValue.includes(opt.value))
    }
    return options.find((opt) => opt.value === selectedValue)
  }, [options, selectedValue, multiple])

  useEffect(() => {
    if (!closeOnOutsideClick || !isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeOnOutsideClick, setIsOpen])

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  const handleOptionClick = useCallback(
    (option: GluuDropdownOption<T>) => {
      if (option.disabled || option.divider) return

      option.onClick?.(option.value, option)
      onSelect?.(option.value, option)

      if (closeOnSelect) {
        setIsOpen(false)
        setInternalState((prev) => ({ ...prev, searchQuery: '' }))
      }
    },
    [onSelect, closeOnSelect, setIsOpen],
  )

  const handleTriggerClick = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }, [disabled, isOpen, setIsOpen])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalState((prev) => ({ ...prev, searchQuery: e.target.value }))
  }, [])

  const menuStyle = useMemo<React.CSSProperties>(() => {
    const style: React.CSSProperties = {}
    if (minWidth) {
      style.minWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth
    }
    if (maxWidth) {
      style.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
    }
    if (maxHeight) {
      style.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
    }
    return style
  }, [minWidth, maxWidth, maxHeight])

  const selectedOption = getSelectedOption()

  const renderOptions = useMemo(() => {
    if (filteredOptions.length === 0) {
      return <div className={classes.emptyMessage}>{emptyMessage}</div>
    }

    return filteredOptions.map((option) => {
      if (option.divider) {
        return <div key={`divider-${option.value}`} className={classes.divider} />
      }

      const optionIsSelected = isSelected(option.value)
      const optionContent = renderOption ? renderOption(option, optionIsSelected) : option.label

      return (
        <div
          key={String(option.value)}
          className={`${classes.option} ${optionIsSelected ? 'selected' : ''} ${
            option.disabled ? 'disabled' : ''
          }`}
          onClick={() => handleOptionClick(option)}
        >
          {option.icon && <span>{option.icon}</span>}
          {optionContent}
        </div>
      )
    })
  }, [filteredOptions, isSelected, renderOption, classes, emptyMessage, handleOptionClick])

  return (
    <div className={`${classes.dropdownWrapper} ${className || ''}`} ref={dropdownRef}>
      <div onClick={handleTriggerClick} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {renderTrigger ? renderTrigger(isOpen, selectedOption) : trigger || null}
      </div>
      {isOpen && (
        <Box
          ref={menuRef}
          className={`${classes.dropdownMenu} ${dropdownClassName || ''}`}
          style={menuStyle}
        >
          {showArrow && (
            <div className={classes.arrow}>
              <ArrowIcon />
            </div>
          )}
          {searchable && (
            <input
              ref={searchInputRef}
              type="text"
              className={classes.searchInput}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          )}
          {renderOptions}
        </Box>
      )}
    </div>
  )
}

GluuDropdown.displayName = 'GluuDropdown'

export default GluuDropdown
