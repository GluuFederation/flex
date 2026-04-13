import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FormGroup, Col, Input } from 'Components'
import { formatDate } from '@/utils/dayjsUtils'
import { ChevronIcon } from '@/components/SVG'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import type { JwkItemWithClassesProps, ReadOnlyFieldProps } from '../types'
import { DATE_FORMAT } from '../constants'

const MAX_TEXTAREA_ROWS = 8
const MIN_TEXTAREA_ROWS = 2
const CHARS_PER_LINE = 80

const EMPTY_FIELD_PLACEHOLDER = 'No value'

const getTextareaRows = (value: string): number => {
  const lineCount = Math.ceil(value.length / CHARS_PER_LINE) + value.split('\n').length - 1
  return Math.min(Math.max(lineCount, MIN_TEXTAREA_ROWS), MAX_TEXTAREA_ROWS)
}

const ReadOnlyField = React.memo<ReadOnlyFieldProps>(
  ({ label, value, type = 'text', lsize = 12, rsize = 12, emptyPlaceholder }) => {
    const hasValue = value != null && value !== ''
    const displayValue = value ?? ''
    const placeholder = hasValue ? undefined : (emptyPlaceholder ?? EMPTY_FIELD_PLACEHOLDER)
    return (
      <FormGroup row>
        <GluuLabel label={label} size={lsize} />
        <Col sm={rsize}>
          <Input
            type={type}
            name={label}
            data-testid={label}
            readOnly
            value={displayValue}
            placeholder={placeholder}
            {...(type === 'textarea'
              ? { rows: getTextareaRows(hasValue ? displayValue : '') }
              : {})}
          />
        </Col>
      </FormGroup>
    )
  },
)

ReadOnlyField.displayName = 'ReadOnlyField'

const JwkItem = React.memo<JwkItemWithClassesProps>(({ item, classes }) => {
  const { t } = useTranslation()
  const emptyPlaceholder = t('fields.no_value')
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    },
    [toggle],
  )

  const headerClassName = isOpen
    ? `${classes.accordionHeader} ${classes.accordionHeaderOpen}`
    : classes.accordionHeader

  return (
    <div className={classes.accordionWrapper}>
      <div
        className={headerClassName}
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
      >
        <span>{item.name ?? t('fields.unnamed_key')}</span>
        <span className={classes.accordionIcon}>
          <ChevronIcon width={16} height={16} direction={isOpen ? 'up' : 'down'} />
        </span>
      </div>
      {isOpen && (
        <div className={classes.accordionBody}>
          <div className={classes.fieldItemFullWidth}>
            <ReadOnlyField
              label="description"
              value={item.descr ?? ''}
              emptyPlaceholder={emptyPlaceholder}
            />
          </div>

          <div className={classes.fieldsGrid}>
            <div className={classes.fieldItem}>
              <ReadOnlyField
                label="crv"
                value={item.crv ?? ''}
                emptyPlaceholder={emptyPlaceholder}
              />
            </div>
            <div className={classes.fieldItem}>
              <ReadOnlyField
                label="exp"
                value={item.exp != null ? formatDate(item.exp, DATE_FORMAT) : ''}
                emptyPlaceholder={emptyPlaceholder}
              />
            </div>
            <div className={classes.fieldItem}>
              <ReadOnlyField
                label="use"
                value={item.use ?? ''}
                emptyPlaceholder={emptyPlaceholder}
              />
            </div>
            <div className={classes.fieldItem}>
              <ReadOnlyField
                label="kty"
                value={item.kty ?? ''}
                emptyPlaceholder={emptyPlaceholder}
              />
            </div>
            <div className={classes.fieldItem}>
              <ReadOnlyField
                label="alg"
                value={item.alg ?? ''}
                emptyPlaceholder={emptyPlaceholder}
              />
            </div>
            <div className={classes.fieldItem}>
              <ReadOnlyField label="e" value={item.e ?? ''} emptyPlaceholder={emptyPlaceholder} />
            </div>
          </div>

          <div className={classes.fieldItemFullWidth}>
            <ReadOnlyField label="kid" value={item.kid ?? ''} emptyPlaceholder={emptyPlaceholder} />
          </div>

          {Array.isArray(item.x5c) && item.x5c.length > 0 && (
            <div className={classes.fieldItemFullWidth}>
              <ReadOnlyField
                label="x5c"
                value={item.x5c[0] ?? ''}
                type="textarea"
                emptyPlaceholder={emptyPlaceholder}
              />
            </div>
          )}

          {(item.x != null || item.y != null) && (
            <div className={classes.fieldsGrid}>
              {item.x != null && (
                <div className={classes.fieldItem}>
                  <ReadOnlyField
                    label="x"
                    value={item.x}
                    type="textarea"
                    emptyPlaceholder={emptyPlaceholder}
                  />
                </div>
              )}
              {item.y != null && (
                <div className={classes.fieldItem}>
                  <ReadOnlyField
                    label="y"
                    value={item.y}
                    type="textarea"
                    emptyPlaceholder={emptyPlaceholder}
                  />
                </div>
              )}
            </div>
          )}

          {item.n && (
            <div className={classes.fieldItemFullWidth}>
              <ReadOnlyField
                label="n"
                value={item.n}
                type="textarea"
                emptyPlaceholder={emptyPlaceholder}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
})

JwkItem.displayName = 'JwkItem'

export default JwkItem
