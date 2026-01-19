import React from 'react'
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import './JsonViewer.css'
import customColors from '@/customColors'
import { THEME_DARK, THEME_LIGHT, ThemeValue } from '@/context/theme/constants'

interface JsonViewerProps {
  data: unknown
  theme?: ThemeValue
  expanded?: boolean
  style?: React.CSSProperties
  className?: string
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  theme = THEME_LIGHT,
  expanded = true,
  style = {},
  className = '',
}) => {
  const styles = theme === THEME_DARK ? darkStyles : defaultStyles
  const shouldExpand = expanded ? allExpanded : undefined

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
        backgroundColor: theme === THEME_DARK ? customColors.black : customColors.white,
        ...style,
      }}
    >
      <JsonView data={jsonData} style={styles} shouldExpandNode={shouldExpand} />
    </div>
  )
}

JsonViewer.displayName = 'JsonViewer'

export default JsonViewer
