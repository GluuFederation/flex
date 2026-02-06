import { useMemo, useContext, type CSSProperties } from 'react'
import { Label } from 'Components'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import applicationStyle from './styles/applicationstyle'
import { HelpOutline } from '@mui/icons-material'
import customColors from '@/customColors'
import { ThemeContext } from '@/context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'

interface GluuLabelProps {
  label: string
  required?: boolean
  size?: number
  doc_category?: string
  doc_entry?: string
  style?: CSSProperties
  allowColon?: boolean
}

function GluuLabel({
  label,
  required,
  size,
  doc_category,
  doc_entry,
  style,
  allowColon = true,
}: GluuLabelProps) {
  const { t, i18n } = useTranslation()
  const theme = useContext(ThemeContext)

  const { labelColor, tooltipStyle } = useMemo(() => {
    const selectedTheme = theme?.state?.theme || DEFAULT_THEME
    const isDarkTheme = selectedTheme === THEME_DARK
    return {
      labelColor: isDarkTheme ? customColors.white : customColors.primaryDark,
      tooltipStyle: isDarkTheme
        ? { backgroundColor: customColors.white, color: customColors.primaryDark }
        : undefined,
    }
  }, [theme?.state?.theme])

  function getSize() {
    if (size != null) {
      return size
    }
    return 3
  }

  const labelStyle = useMemo(
    () => ({
      color: labelColor,
      ...style,
    }),
    [labelColor, style],
  )

  return (
    <Label for={t(label)} sm={getSize()} data-for={doc_entry} style={labelStyle}>
      <h5
        className="d-flex justify-content-between align-items-center"
        aria-label={label}
        style={{ color: labelColor }}
      >
        <span className="d-flex align-items-center">
          {t(label)}
          {allowColon && <span>:</span>}
          {required && <span style={applicationStyle.fieldRequired}> *</span>}
          {doc_category && i18n.exists('documentation.' + doc_category + '.' + doc_entry) && (
            <>
              <ReactTooltip
                id={doc_entry}
                place="right"
                role="tooltip"
                style={{ zIndex: 101, maxWidth: '45vw', ...tooltipStyle }}
              >
                {t('documentation.' + doc_category + '.' + doc_entry)}
              </ReactTooltip>
              <HelpOutline
                tabIndex={-1}
                style={{ width: 18, height: 18, marginLeft: 0, marginRight: 6, color: labelColor }}
                data-tooltip-id={doc_entry}
                data-for={doc_entry}
              />
            </>
          )}
        </span>
      </h5>
    </Label>
  )
}

export default GluuLabel
