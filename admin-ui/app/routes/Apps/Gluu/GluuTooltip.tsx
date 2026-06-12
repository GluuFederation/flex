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
import { tooltipManager } from '@/utils/tooltipManager'
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
    tooltipManager.addListener(doc_entry, setAnchorEl)
    return () => {
      tooltipManager.removeListener(doc_entry, setAnchorEl)
      setAnchorEl(null)
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
