import { useState } from 'react'
import { FormGroup, Label, Col } from 'Components'
import Toggle from 'react-toggle'
import GluuTooltip from './GluuTooltip'
import { useTranslation } from 'react-i18next'

function GluuSecretDetail({ label, value, doc_category, doc_entry, lsize = 6, rsize = 6 }: any) {
  const { t } = useTranslation()
  const [up, setUp] = useState(false)
  function handleSecret() {
    setUp(!up)
  }

  return (
    <GluuTooltip doc_category={doc_category} doc_entry={doc_entry || label}>
      <FormGroup row className="align-items-center mb-2">
        <Label for="input" sm={lsize} style={{ fontWeight: 'bold' }}>
          {t(label)}:
        </Label>
        <Col
          sm={rsize}
          className="d-flex align-items-center"
          style={{ gap: '0.5rem', wordBreak: 'break-all' }}
        >
          {value !== '-' && <Toggle defaultChecked={false} onChange={handleSecret} />}
          {up && (
            <span style={{ fontWeight: 'bold' }} data-testid="secret-value">
              {value}
            </span>
          )}
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

export default GluuSecretDetail
