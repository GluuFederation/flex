import React from 'react'
import { Label } from './../../../components'
import ReactTooltip from 'react-tooltip'
import { useTranslation } from 'react-i18next'

function GluuLabel({ label, required, size, withTooltip }) {
  const { t } = useTranslation()
  function getSize() {
    if (size != null) {
      return size
    }
    return 3
  }
  return (
    <Label sm={getSize()} data-tip data-for={label}>
      <h5>
        {t(label)}
        {required && <span style={{ color: 'red', fontSize: '22px' }}> *</span>}
        :
      </h5>
      {withTooltip && (
        <ReactTooltip type="success" id={label}>
          {withTooltip || label}
        </ReactTooltip>
      )}
    </Label>
  )
}

export default GluuLabel
