import React from 'react'
import { Label } from 'Components'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import applicationStyle from './styles/applicationstyle'
import { HelpOutline } from '@mui/icons-material'

function GluuLabel({ label, required, size, doc_category, doc_entry, style, noColon = false }) {
  const { t } = useTranslation()
  function getSize() {
    if (size != null) {
      return size
    }
    return 3
  }
  return (
    <Label for={t(label)} sm={getSize()} data-for={doc_entry} style={style}>
      <h5 className='d-flex' aria-label={label}>
        {t(label)}
        {required && <span style={applicationStyle.fieldRequired}> *</span>}
        
        {doc_category &&  
          <>
            <ReactTooltip
              tabIndex="-1"
              id={doc_entry}
              place="right"
              role="tooltip"
              style={{ zIndex: 101 }}
            >
              {t('documentation.' + doc_category + '.' + doc_entry)}
            </ReactTooltip>
            <HelpOutline tabIndex="-1" style={{ width: 18, height: 18, marginLeft:6, marginRight:6 }} data-tooltip-id={doc_entry} data-for={doc_entry} />
          </>
        }
        :
      </h5>
      {/* {doc_category && (
        <ReactTooltip
          html={true}
          type="success"
          id={doc_entry}
          data-testid={doc_entry}
        >
          {t('documentation.' + doc_category + '.' + doc_entry)}
        </ReactTooltip>
      )} */}
    </Label>
  )
}

export default GluuLabel
