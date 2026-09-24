import React, { memo, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { useStyles, DETAIL_LABEL_WIDTH_VAR } from './GluuDetailGrid.style'
import type { GluuDetailGridProps, GluuDetailGridField } from './types'

const getFieldKey = (field: GluuDetailGridField, idx: number): string =>
  field.doc_entry ?? `${field.label}-${idx}`

const measureWidestLabel = (grid: HTMLElement, labelClassName: string): number => {
  let widest = 0
  grid.querySelectorAll<HTMLElement>(`.${labelClassName}`).forEach((label) => {
    const container = label.parentElement
    const containerStyle = container ? getComputedStyle(container) : null
    const padding = containerStyle
      ? (parseFloat(containerStyle.paddingLeft) || 0) +
        (parseFloat(containerStyle.paddingRight) || 0)
      : 0
    widest = Math.max(widest, Math.ceil(label.getBoundingClientRect().width + padding))
  })
  return widest
}

const GluuDetailGrid: React.FC<GluuDetailGridProps> = ({
  fields,
  labelStyle,
  defaultDocCategory,
  className,
  layout = 'column',
}) => {
  const { classes } = useStyles()
  const { i18n } = useTranslation()
  const gridRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    let active = true
    const measure = () => {
      if (!active) return
      const width = `${measureWidestLabel(grid, classes.detailLabel)}px`
      if (grid.style.getPropertyValue(DETAIL_LABEL_WIDTH_VAR) !== width) {
        grid.style.setProperty(DETAIL_LABEL_WIDTH_VAR, width)
      }
    }
    measure()
    document.fonts?.ready.then(measure)
    const observer = new ResizeObserver(measure)
    observer.observe(grid)
    return () => {
      active = false
      observer.disconnect()
    }
  }, [fields, i18n.language, classes.detailLabel])

  return (
    <div ref={gridRef} className={`${classes.detailGrid} ${className ?? ''}`.trim()}>
      {fields.map((field, idx) => (
        <div
          key={getFieldKey(field, idx)}
          className={field.fullWidth ? classes.detailItemFullWidth : classes.detailItem}
        >
          <GluuFormDetailRow
            label={field.label}
            value={field.value}
            valueNode={field.valueNode}
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
            labelClassName={classes.detailLabel}
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
