import React, { useState, useRef, useEffect, useContext, useMemo, useCallback, memo } from 'react'
import Box from '@mui/material/Box'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'
import { useStyles } from './ThemeDropdown.style'
import type { DropdownOption, ThemeDropdownProps } from './types'

const ArrowIcon = memo(() => (
  <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 0L0 10H15L7.5 0Z" fill="currentColor" />
  </svg>
))
ArrowIcon.displayName = 'ArrowIcon'

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

    return (
      <div className={`${classes.dropdownWrapper} ${className || ''}`} ref={dropdownRef}>
        <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
          {trigger}
        </div>
        {isOpen && (
          <>
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
              {options.map((option) => (
                <div
                  key={option.value}
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
