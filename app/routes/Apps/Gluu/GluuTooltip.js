import React from 'react'
import ReactTooltip from 'react-tooltip'
import { useTranslation } from 'react-i18next'

function GluuTooltip(props) {
  const { t } = useTranslation()
  return (
    <div data-tip data-for={props.doc_entry}>
      {props.children}
      <ReactTooltip html type="success" id={props.doc_entry} place="bottom">
        {t('documentation.' + props.doc_category + '.' + props.doc_entry)}
      </ReactTooltip>
    </div>
  )
}

export default GluuTooltip
