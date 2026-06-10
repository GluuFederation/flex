import { useEffect, useMemo, useState } from 'react'
import Popper from '@mui/material/Popper'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_DARK } from '@/context/theme/constants'
import { TOOLTIP } from '@/constants'
import {
  DEFAULT_Z_INDEX,
  getLabelTooltipStyle,
  useStyles,
  TOOLTIP_ARROW_CLASS,
} from './styles/GluuTooltip.style'
import type { GluuTooltipProps } from './types'

const GluuTooltip = ({
  doc_category = '',
  doc_entry,
  isDirect,
  children,
  tooltipOnly = false,
  zIndex = DEFAULT_Z_INDEX,
  place = 'bottom',
  content: contentOverride,
  positionStrategy = 'absolute',
  offset,
}: GluuTooltipProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const isDarkTheme = themeState?.theme === THEME_DARK
  const { classes } = useStyles()

  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const tooltipStyle = useMemo(
    () => getLabelTooltipStyle(isDarkTheme, zIndex),
    [isDarkTheme, zIndex],
  )

  const tooltipContent =
    contentOverride !== undefined
      ? contentOverride
      : isDirect
        ? doc_category
        : doc_category
          ? t(`documentation.${doc_category}.${doc_entry}`)
          : doc_entry

  useEffect(() => {
    const resolveAnchor = (target: EventTarget | null): Element | null => {
      if (!(target instanceof Element)) return null
      const el = target.closest('[data-tooltip-id]')
      return el?.getAttribute('data-tooltip-id') === doc_entry ? el : null
    }
    const show = (event: Event) => {
      const el = resolveAnchor(event.target)
      if (el) setAnchorEl(el)
    }
    const hide = (event: Event) => {
      if (resolveAnchor(event.target)) setAnchorEl(null)
    }
    document.addEventListener('mouseover', show)
    document.addEventListener('mouseout', hide)
    document.addEventListener('focusin', show)
    document.addEventListener('focusout', hide)
    return () => {
      document.removeEventListener('mouseover', show)
      document.removeEventListener('mouseout', hide)
      document.removeEventListener('focusin', show)
      document.removeEventListener('focusout', hide)
    }
  }, [doc_entry])

  const modifiers = useMemo(
    () => [{ name: 'offset', options: { offset: [0, offset ?? TOOLTIP.OFFSET] } }],
    [offset],
  )

  const tooltipElement = (
    <Popper
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement={place}
      modifiers={modifiers}
      popperOptions={{ strategy: positionStrategy }}
      className={classes.popper}
      style={{ zIndex }}
    >
      <div className={classes.inner}>
        <div data-testid={doc_entry} className={classes.tooltip} style={tooltipStyle}>
          {tooltipContent}
        </div>
        <span
          className={TOOLTIP_ARROW_CLASS}
          style={{ backgroundColor: tooltipStyle.backgroundColor }}
        />
      </div>
    </Popper>
  )

  if (tooltipOnly) {
    return tooltipElement
  }

  return (
    <div data-tooltip-id={doc_entry}>
      {children ?? null}
      {tooltipElement}
    </div>
  )
}

export default GluuTooltip
