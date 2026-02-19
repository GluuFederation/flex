import React, { useMemo, type CSSProperties } from 'react'
import { Label } from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from './styles/applicationstyle'
import { HelpOutline } from '@mui/icons-material'
import getThemeColor from '@/context/theme/config'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'
import GluuTooltip from './GluuTooltip'

interface GluuLabelProps {
  label: string
  required?: boolean
  size?: number
  doc_category?: string
  doc_entry?: string
  style?: CSSProperties
  allowColon?: boolean
  isDark?: boolean
}

const getSize = (size: number | undefined): number => (size != null ? size : 3)

const GluuLabel: React.FC<GluuLabelProps> = ({
  label,
  required,
  size,
  doc_category,
  doc_entry,
  style,
  allowColon = true,
  isDark: isDarkProp,
}) => {
  const { t, i18n } = useTranslation()
  const { state: themeState } = useTheme()
  const isDarkTheme =
    isDarkProp === true || (isDarkProp !== false && themeState?.theme === THEME_DARK)

  const labelColor = useMemo(() => {
    const darkTheme = getThemeColor(THEME_DARK)
    const lightTheme = getThemeColor(THEME_LIGHT)
    return isDarkTheme ? darkTheme.fontColor : lightTheme.fontColor
  }, [isDarkTheme])

  const labelStyle = useMemo(
    () => ({
      color: labelColor,
      ...style,
    }),
    [labelColor, style],
  )

  return (
    <Label for={t(label)} sm={getSize(size)} data-for={doc_entry} style={labelStyle}>
      <h5
        className="d-flex justify-content-between align-items-center"
        aria-label={label}
        style={{ color: labelColor }}
      >
        <span className="d-flex align-items-center">
          {t(label)}
          {allowColon && <span>:</span>}
          {required && <span style={applicationStyle.fieldRequired}> *</span>}
          {doc_category &&
            doc_entry &&
            i18n.exists('documentation.' + doc_category + '.' + doc_entry) && (
              <>
                <GluuTooltip
                  tooltipOnly
                  doc_entry={doc_entry}
                  doc_category={doc_category}
                  place="right"
                />
                <HelpOutline
                  tabIndex={-1}
                  style={{
                    width: 18,
                    height: 18,
                    marginLeft: 0,
                    marginRight: 6,
                    color: labelColor,
                    fill: labelColor,
                  }}
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
