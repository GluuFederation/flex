import { useContext, useMemo, type ReactNode } from 'react'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'

interface GluuTooltipProps {
  doc_category?: string
  doc_entry: string
  isDirect?: boolean
  children: ReactNode
}

const GluuTooltip = ({ doc_category = '', doc_entry, isDirect, children }: GluuTooltipProps) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme

  const tooltipStyle = useMemo(() => {
    const lightTheme = getThemeColor(THEME_LIGHT)
    const isDarkTheme = selectedTheme === THEME_DARK

    if (isDarkTheme) {
      return {
        backgroundColor: lightTheme.menu.background,
        color: lightTheme.fontColor,
      }
    }

    return {
      backgroundColor: lightTheme.fontColor,
      color: lightTheme.card.background,
    }
  }, [selectedTheme])

  const tooltipContent = isDirect ? doc_category : t(`documentation.${doc_category}.${doc_entry}`)

  return (
    <div data-tooltip-id={doc_entry} data-tip data-for={doc_entry}>
      {children}
      <ReactTooltip
        id={doc_entry}
        className={`type-${selectedTheme ?? 'light'}`}
        data-testid={doc_entry}
        place="bottom"
        role="tooltip"
        style={{ zIndex: 101, maxWidth: '45vw', ...tooltipStyle }}
      >
        {tooltipContent}
      </ReactTooltip>
    </div>
  )
}

export default GluuTooltip
