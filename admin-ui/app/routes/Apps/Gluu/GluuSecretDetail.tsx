import { useState, memo, useCallback, CSSProperties, useMemo } from 'react'
import { FormGroup, Label, Col } from 'Components'
import Toggle from 'react-toggle'
import GluuTooltip from './GluuTooltip'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import type { GluuSecretDetailProps } from './types'
import { useStyles } from './styles/GluuSecretDetail.style'

const defaultLabelStyle: CSSProperties = { fontWeight: 'bold', color: customColors.black }

const GluuSecretDetail = ({
  label,
  value,
  doc_category,
  doc_entry,
  lsize = 6,
  rsize = 6,
  labelStyle,
  rowClassName,
}: GluuSecretDetailProps) => {
  const { t } = useTranslation()
  const [up, setUp] = useState(false)

  const handleSecret = useCallback(() => {
    setUp((prev) => !prev)
  }, [])

  const appliedLabelStyle: CSSProperties = useMemo(
    () => ({ ...defaultLabelStyle, ...labelStyle }),
    [labelStyle],
  )
  const { classes } = useStyles()
  const appliedRowClassName = rowClassName || classes.rowDefault

  const valueStyle: CSSProperties = useMemo(
    () => ({ fontWeight: 'bold', color: customColors.black }),
    [],
  )

  return (
    <GluuTooltip doc_category={doc_category} doc_entry={doc_entry || label}>
      <FormGroup row className={appliedRowClassName}>
        <Label for="input" sm={lsize} style={appliedLabelStyle}>
          {t(label)}:
        </Label>
        <Col
          sm={rsize}
          className={classes.valueCol}
          style={{ gap: '0.5rem', wordBreak: 'break-all' }}
        >
          {value !== '-' && <Toggle defaultChecked={false} onChange={handleSecret} />}
          {(value === '-' || up) && (
            <span style={valueStyle} data-testid="secret-value">
              {value}
            </span>
          )}
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

export default memo(GluuSecretDetail)
