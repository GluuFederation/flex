import React from 'react'
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import './JsonViewer.css'
import customColors from '@/customColors'

interface JsonViewerProps {
  data: unknown
  theme?: 'light' | 'dark'
  expanded?: boolean
  style?: React.CSSProperties
  className?: string
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  theme = 'light',
  expanded = true,
  style = {},
  className = '',
}) => {
  const styles = theme === 'dark' ? darkStyles : defaultStyles
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
        backgroundColor: theme === 'dark' ? customColors.black : customColors.white,
        ...style,
      }}
    >
      <JsonView data={jsonData} style={styles} shouldExpandNode={shouldExpand} />
    </div>
  )
}

JsonViewer.displayName = 'JsonViewer'

export default JsonViewer
