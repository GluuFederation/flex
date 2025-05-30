// @ts-nocheck
import React, { useContext } from 'react'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'

function GluuTooltip(props) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  return (
    <div data-tooltip-id={props.doc_entry} data-tip data-for={props.doc_entry}>
      {props.children}
      <ReactTooltip
        type="success"
        id={props.doc_entry}
        className={`type-${selectedTheme}`}
        data-testid={props.doc_entry}
        place="bottom"
        role="tooltip"
        style={{ zIndex: 101, maxWidth: '45vw' }}
      >
        {props.isDirect
          ? props.doc_category
          : t('documentation.' + props.doc_category + '.' + props.doc_entry)}
      </ReactTooltip>
    </div>
  )
}

export default GluuTooltip
