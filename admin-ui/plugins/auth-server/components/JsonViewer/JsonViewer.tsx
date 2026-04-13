import React, { useMemo } from 'react'
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK, THEME_LIGHT } from '@/context/theme/constants'
import type { JsonViewerProps } from './types'
import { useStyles } from './JsonViewer.style'

type JsonViewerClasses = ReturnType<typeof useStyles>['classes']

const joinClasses = (...classNames: Array<string | false>) => classNames.filter(Boolean).join(' ')

const getViewerStyles = (classes: JsonViewerClasses, useThemeColors: boolean) => ({
  ...defaultStyles,
  container: joinClasses(defaultStyles.container, classes.container),
  label: joinClasses(defaultStyles.label, useThemeColors && classes.textColor),
  clickableLabel: joinClasses(
    defaultStyles.clickableLabel,
    useThemeColors && classes.clickableLabel,
  ),
  nullValue: joinClasses(defaultStyles.nullValue, useThemeColors && classes.textColor),
  undefinedValue: joinClasses(defaultStyles.undefinedValue, useThemeColors && classes.textColor),
  stringValue: joinClasses(defaultStyles.stringValue, useThemeColors && classes.textColor),
  booleanValue: joinClasses(defaultStyles.booleanValue, useThemeColors && classes.textColor),
  numberValue: joinClasses(defaultStyles.numberValue, useThemeColors && classes.textColor),
  otherValue: joinClasses(defaultStyles.otherValue, useThemeColors && classes.textColor),
  punctuation: joinClasses(defaultStyles.punctuation, useThemeColors && classes.textColor),
  collapseIcon: joinClasses(
    defaultStyles.collapseIcon,
    classes.iconSize,
    useThemeColors && classes.iconColor,
  ),
  expandIcon: joinClasses(
    defaultStyles.expandIcon,
    classes.iconSize,
    useThemeColors && classes.iconColor,
  ),
  collapsedContent: joinClasses(
    defaultStyles.collapsedContent,
    useThemeColors && classes.textColor,
  ),
})

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  theme = THEME_LIGHT,
  expanded = true,
  style = {},
  className = '',
  backgroundColor,
}) => {
  const themeColors = useMemo(() => getThemeColor(theme), [theme])
  const { classes } = useStyles({ themeColors })
  const shouldExpand = expanded ? allExpanded : undefined
  const styles = getViewerStyles(classes, theme === THEME_DARK)

  const isValidJsonData = (value: unknown): value is Record<string, unknown> | unknown[] => {
    return typeof value === 'object' && value !== null
  }

  const jsonData = isValidJsonData(data) ? data : {}

  return (
    <div
      className={`json-viewer ${className}`}
      style={{
        padding: '1rem',
        borderRadius: '4px',
        backgroundColor: backgroundColor ?? themeColors.card.background,
        ...style,
      }}
    >
      <JsonView data={jsonData} style={styles} shouldExpandNode={shouldExpand} />
    </div>
  )
}

JsonViewer.displayName = 'JsonViewer'

export default JsonViewer
