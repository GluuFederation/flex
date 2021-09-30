import React from 'react'
import ReactTooltip from 'react-tooltip'
import { useTranslation } from 'react-i18next'

function GluuTooltip(props) {
  const { t } = useTranslation()
  return (
    <div data-tip data-for={props.id}>
      {props.children}
      <ReactTooltip html={true} type="success" id={props.id} place="bottom">
        {t('documentation.' + props.id)}
      </ReactTooltip>
    </div>
  )
}

export default GluuTooltip
