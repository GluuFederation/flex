import React, { useMemo } from 'react'
import { Label } from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from './styles/applicationStyle'
import { HelpOutline } from '@/components/icons'
import getThemeColor from '@/context/theme/config'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'
import GluuTooltip from './GluuTooltip'
import type { GluuLabelProps } from './types'
import { useStyles } from './styles/GluuLabel.style'

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
  isDirect,
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
  const { classes } = useStyles({ labelColor })

  return (
    <Label for={t(label)} sm={getSize(size)} data-for={doc_entry} style={labelStyle}>
      <h5 className={classes.titleRow} aria-label={label}>
        <span className={classes.titleContent}>
          {t(label)}
          {allowColon && <span>:</span>}
          {required && <span style={applicationStyle.fieldRequired}> *</span>}
          {doc_category &&
            doc_entry &&
            (isDirect || i18n.exists('documentation.' + doc_category + '.' + doc_entry)) && (
              <>
                <GluuTooltip
                  tooltipOnly
                  doc_entry={doc_entry}
                  doc_category={doc_category}
                  isDirect={isDirect}
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
