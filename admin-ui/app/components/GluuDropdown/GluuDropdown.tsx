import React, { useState, useRef, useEffect, useContext, useMemo, useCallback, useId } from 'react'
import Box from '@mui/material/Box'
import { ThemeContext } from 'Context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { ArrowIcon } from 'Components'
import customColors from '@/customColors'
import { NO_TEXT_SELECT } from './sharedDropdownStyles'
import { useStyles } from './GluuDropdown.style'
import type { DropdownValue, GluuDropdownOption, GluuDropdownProps, DropdownState } from './types'

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
  centerText = false,
}: GluuDropdownProps<T>): React.ReactElement {
  const [internalState, setInternalState] = useState<DropdownState>({
    isOpen: false,
    searchQuery: '',
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const dropdownBg = useMemo(() => {
    return isDark ? customColors.darkDropdownBg : customColors.white
  }, [isDark])
  const { classes } = useStyles({ isDark, position, dropdownBg, centerText })

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

  const extractTextFromReactNode = useCallback((node: React.ReactNode): string => {
    if (typeof node === 'string') return node
    if (typeof node === 'number') return String(node)
    if (React.isValidElement(node) && node.props.children) {
      const { children } = node.props
      if (Array.isArray(children)) {
        return children.map((child) => extractTextFromReactNode(child)).join('')
      }
      return extractTextFromReactNode(children)
    }
    if (Array.isArray(node)) {
      return node.map((child) => extractTextFromReactNode(child)).join('')
    }
    return ''
  }, [])

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return options
    }

    const query = searchQuery.toLowerCase().trim()
    return options.filter((option) => {
      if (option.divider) return true
      const searchText = option.searchValue
        ? option.searchValue.toLowerCase()
        : typeof option.label === 'string'
          ? option.label.toLowerCase()
          : extractTextFromReactNode(option.label).toLowerCase()
      return searchText.includes(query)
    })
  }, [options, searchQuery, searchable, extractTextFromReactNode])

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

  const getSelectedOption = useCallback(():
    | GluuDropdownOption<T>
    | GluuDropdownOption<T>[]
    | undefined => {
    if (selectedValue === undefined) return undefined
    if (multiple && Array.isArray(selectedValue)) {
      return options.filter((opt) => selectedValue.includes(opt.value))
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

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleTriggerClick()
      }
    },
    [disabled, handleTriggerClick],
  )

  const handleTriggerMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      e.preventDefault()
    },
    [disabled],
  )

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

    return filteredOptions.map((option, index) => {
      if (option.divider) {
        return <div key={`divider-${index}-${option.value}`} className={classes.divider} />
      }

      const optionIsSelected = isSelected(option.value)
      const optionContent = renderOption ? renderOption(option, optionIsSelected) : option.label

      const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (option.disabled) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleOptionClick(option)
        }
      }

      return (
        <div
          key={`option-${index}-${String(option.value)}`}
          className={`${classes.option} ${optionIsSelected ? 'selected' : ''} ${
            option.disabled ? 'disabled' : ''
          } ${filteredOptions.length === 1 && !option.icon ? 'single-option' : ''}`}
          role="option"
          aria-selected={optionIsSelected}
          tabIndex={option.disabled ? -1 : 0}
          onClick={() => handleOptionClick(option)}
          onKeyDown={handleKeyDown}
        >
          {option.icon && <span>{option.icon}</span>}
          {optionContent}
        </div>
      )
    })
  }, [filteredOptions, isSelected, renderOption, classes, emptyMessage, handleOptionClick])

  return (
    <div className={`${classes.dropdownWrapper} ${className || ''}`} ref={dropdownRef}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        onMouseDown={handleTriggerMouseDown}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          ...NO_TEXT_SELECT,
        }}
      >
        {renderTrigger ? renderTrigger(isOpen, selectedOption) : trigger || null}
      </div>
      {isOpen && (
        <Box
          ref={menuRef}
          className={`${classes.dropdownMenu} ${dropdownClassName || ''}`}
          style={menuStyle}
          role="listbox"
          id={listboxId}
        >
          {showArrow && (
            <div className={classes.arrow}>
              <ArrowIcon />
            </div>
          )}
          <div className={classes.dropdownMenuContent}>
            {searchable && (
              <input
                ref={searchInputRef}
                type="text"
                className={classes.searchInput}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                role="searchbox"
                aria-label={searchPlaceholder || 'Search dropdown options'}
                aria-autocomplete="list"
                aria-controls={listboxId}
              />
            )}
            {renderOptions}
          </div>
        </Box>
      )}
    </div>
  )
}

GluuDropdown.displayName = 'GluuDropdown'

export default GluuDropdown
