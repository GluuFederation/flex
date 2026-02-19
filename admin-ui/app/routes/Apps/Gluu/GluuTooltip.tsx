import { useMemo, type ReactNode } from 'react'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_DARK } from '@/context/theme/constants'
import { DEFAULT_Z_INDEX, getLabelTooltipStyle } from './styles/GluuTooltip.style'

interface GluuTooltipProps {
  doc_category?: string
  doc_entry: string
  isDirect?: boolean
  children?: ReactNode
  tooltipOnly?: boolean
  zIndex?: number
  place?: 'top' | 'right' | 'bottom' | 'left'
  content?: ReactNode
  positionStrategy?: 'absolute' | 'fixed'
}

const GluuTooltip = ({
  doc_category = '',
  doc_entry,
  isDirect,
  children,
  tooltipOnly = false,
  zIndex = DEFAULT_Z_INDEX,
  place = 'bottom',
  content: contentOverride,
  positionStrategy,
}: GluuTooltipProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme
  const isDarkTheme = selectedTheme === THEME_DARK

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

  const tooltipElement = (
    <ReactTooltip
      id={doc_entry}
      className={`type-${selectedTheme ?? 'light'}`}
      data-testid={doc_entry}
      place={place}
      role="tooltip"
      style={tooltipStyle}
      positionStrategy={positionStrategy}
    >
      {tooltipContent}
    </ReactTooltip>
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
