import React, { useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import ArrowIcon from '@/components/SVG/Arrow'
import { useSecurityTheme } from '../../SecurityMonitor/hooks'
import { useGranularityMenuStyles } from './GranularityMenu.style'
import type { Granularity, GranularityMenuProps } from '../types'

// Hangs under the date preset that opened it, so the granularities on offer read as belonging to
// the range just chosen. Deliberately not a standalone control: which buckets make sense is a
// property of the range, and a separate always-visible picker invited combinations that produce an
// unreadable chart.
const GranularityMenu: React.FC<GranularityMenuProps> = ({
  options,
  value,
  onSelect,
  onDismiss,
  ariaLabel,
}) => {
  const { isDark } = useSecurityTheme()
  const { classes, cx } = useGranularityMenuStyles({ isDark })

  // Escape closes as well as an outside click; a menu that only the mouse can dismiss strands
  // anyone who opened it from the keyboard.
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
                // `selected` is a plain class name because the shared option styles target
                // `&.selected`, the same hook GluuDropdown uses for its own rows.
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
