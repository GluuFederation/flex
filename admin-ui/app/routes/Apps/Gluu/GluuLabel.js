import React from 'react'
import { Label } from 'Components'
import ReactTooltip from 'react-tooltip'
import { useTranslation } from 'react-i18next'

function GluuLabel({ label, required, size, doc_category, doc_entry }) {
  const { t } = useTranslation()
  function getSize() {
    if (size != null) {
      return size
    }
    return 3
  }
  return (
    <Label for={label} sm={getSize()} data-tip data-for={label}>
      <h5>
        {t(label)}
        {required && <span style={{ color: 'red', fontSize: '22px' }}> *</span>}
        :
      </h5>
      {doc_category && (
        <ReactTooltip
          html={true}
          type="success"
          id={doc_entry}
          data-testid={doc_entry}
        >
          {t('documentation.' + doc_category + '.' + doc_entry)}
        </ReactTooltip>
      )}
    </Label>
  )
}

export default GluuLabel
