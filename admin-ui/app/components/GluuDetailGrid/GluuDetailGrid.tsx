import React, { memo } from 'react'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { useStyles } from './GluuDetailGrid.style'
import type { GluuDetailGridProps, GluuDetailGridField } from './types'

const getFieldKey = (field: GluuDetailGridField, idx: number): string =>
  field.doc_entry ?? `${field.label}-${idx}`

const GluuDetailGrid: React.FC<GluuDetailGridProps> = ({
  fields,
  labelStyle,
  defaultDocCategory,
  className,
  layout = 'column',
}) => {
  const { classes } = useStyles()

  return (
    <div className={`${classes.detailGrid} ${className ?? ''}`.trim()}>
      {fields.map((field, idx) => (
        <div
          key={getFieldKey(field, idx)}
          className={field.fullWidth ? classes.detailItemFullWidth : classes.detailItem}
        >
          <GluuFormDetailRow
            label={field.label}
            value={field.value}
            doc_entry={field.doc_entry}
            doc_category={field.doc_category ?? defaultDocCategory}
            isBadge={field.isBadge}
            badgeBackgroundColor={field.badgeBackgroundColor}
            badgeTextColor={field.badgeTextColor}
            isDirect={field.isDirect}
            lsize={field.lsize}
            rsize={field.rsize}
            labelStyle={
              labelStyle || field.labelStyle ? { ...labelStyle, ...field.labelStyle } : undefined
            }
            valueStyle={field.valueStyle}
            rowClassName={field.rowClassName}
            layout={field.layout ?? layout}
          />
        </div>
      ))}
    </div>
  )
}

export default memo(GluuDetailGrid)
