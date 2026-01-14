import React, { useState, useRef, useEffect, useContext, useMemo, useCallback, memo } from 'react'
import Box from '@mui/material/Box'
import { ThemeContext } from 'Context/theme/themeContext'
import { ArrowIcon } from 'Components'
import customColors from '@/customColors'
import { useStyles } from './ThemeDropdown.style'
import type { DropdownOption, ThemeDropdownProps } from './types'

export const ThemeDropdown = memo<ThemeDropdownProps>(
  ({
    trigger,
    options,
    position = 'bottom',
    selectedValue,
    onSelect,
    className,
    dropdownClassName,
    minWidth,
    maxWidth,
    showArrow = true,
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const theme = useContext(ThemeContext)
    const currentTheme = theme?.state.theme || 'light'
    const isDark = currentTheme === 'dark'
    const dropdownBg = useMemo(() => {
      return isDark ? customColors.darkDropdownBg : customColors.white
    }, [isDark])
    const { classes } = useStyles({ isDark, position, dropdownBg })

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const handleOptionClick = useCallback(
      (option: DropdownOption) => {
        if (option.disabled) return

        option.onClick?.()
        onSelect?.(option.value)
        setIsOpen(false)
      },
      [onSelect],
    )

    const menuStyle = useMemo(() => {
      const style: React.CSSProperties = {}
      if (minWidth) style.minWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth
      if (maxWidth) style.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
      return style
    }, [minWidth, maxWidth])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          e.preventDefault()
          setIsOpen(false)
        }
      },
      [isOpen],
    )

    return (
      <div className={`${classes.dropdownWrapper} ${className || ''}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {trigger}
        </button>
        {isOpen && (
          <>
            <Box
              ref={menuRef}
              className={`${classes.dropdownMenu} ${dropdownClassName || ''}`}
              style={menuStyle}
              role="listbox"
            >
              {showArrow && (
                <div className={classes.arrow}>
                  <ArrowIcon />
                </div>
              )}
              {options.map((option) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={selectedValue === option.value}
                  aria-disabled={option.disabled}
                  className={`${classes.option} ${
                    selectedValue === option.value ? 'selected' : ''
                  } ${option.disabled ? 'disabled' : ''}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))}
            </Box>
          </>
        )}
      </div>
    )
  },
)

ThemeDropdown.displayName = 'ThemeDropdown'

export default ThemeDropdown
