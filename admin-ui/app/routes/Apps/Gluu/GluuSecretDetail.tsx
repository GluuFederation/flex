import { useState, memo, useCallback, CSSProperties } from 'react'
import { FormGroup, Label, Col } from 'Components'
import Toggle from 'react-toggle'
import GluuTooltip from './GluuTooltip'
import { useTranslation } from 'react-i18next'

interface GluuSecretDetailProps {
  label: string
  value: string
  doc_category?: string
  doc_entry?: string
  lsize?: number
  rsize?: number
  labelStyle?: CSSProperties
  rowClassName?: string
}

const defaultLabelStyle: CSSProperties = { fontWeight: 'bold' }

function GluuSecretDetail({
  label,
  value,
  doc_category,
  doc_entry,
  lsize = 6,
  rsize = 6,
  labelStyle,
  rowClassName,
}: GluuSecretDetailProps) {
  const { t } = useTranslation()
  const [up, setUp] = useState(false)

  const handleSecret = useCallback(() => {
    setUp((prev) => !prev)
  }, [])

  const appliedLabelStyle = labelStyle || defaultLabelStyle
  const appliedRowClassName = rowClassName || 'align-items-center mb-2'

  return (
    <GluuTooltip doc_category={doc_category} doc_entry={doc_entry || label}>
      <FormGroup row className={appliedRowClassName}>
        <Label for="input" sm={lsize} style={appliedLabelStyle}>
          {t(label)}:
        </Label>
        <Col
          sm={rsize}
          className="d-flex align-items-center"
          style={{ gap: '0.5rem', wordBreak: 'break-all' }}
        >
          {value !== '-' && <Toggle defaultChecked={false} onChange={handleSecret} />}
          {(value === '-' || up) && (
            <span style={{ fontWeight: 'bold' }} data-testid="secret-value">
              {value}
            </span>
          )}
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

export default memo(GluuSecretDetail)
