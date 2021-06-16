import React from 'react'
import { Label } from './../../../components'
import { useTranslation } from 'react-i18next'

function GluuLabel({ label, required, size }) {
  const { t } = useTranslation()
  function getSize() {
    if (size != null) {
      return size
    }
    return 3
  }
  return (
    <Label sm={getSize()}>
      <h5>
        {t(label)}
        {required && <span style={{ color: 'red', fontSize: '22px' }}> *</span>}
        :
      </h5>
    </Label>
  )
}

export default GluuLabel
