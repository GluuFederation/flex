import React, { useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import ArrowIcon from '@/components/SVG/Arrow'
import { useSecurityTheme } from '../../SecurityMonitor/hooks'
import { useGranularityMenuStyles } from './GranularityMenu.style'
import type { Granularity, GranularityMenuProps } from '../types'

const GranularityMenu: React.FC<GranularityMenuProps> = ({
  options,
  value,
  onSelect,
  onDismiss,
  ariaLabel,
}) => {
  const { isDark } = useSecurityTheme()
  const { classes, cx } = useGranularityMenuStyles({ isDark })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onDismiss])

  const handleSelect = useCallback(
    (next: Granularity) => {
      onSelect(next)
      onDismiss()
    },
    [onSelect, onDismiss],
  )

  return (
    <ClickAwayListener onClickAway={onDismiss}>
      <Box className={classes.menu} role="listbox" aria-label={ariaLabel}>
        <div className={classes.arrow}>
          <ArrowIcon />
        </div>
        <div className={classes.content}>
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <Box
                key={option.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={cx(classes.option, isSelected && 'selected')}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleSelect(option.value)
                  }
                }}
              >
                {option.label}
              </Box>
            )
          })}
        </div>
      </Box>
    </ClickAwayListener>
  )
}

export default React.memo(GranularityMenu)
