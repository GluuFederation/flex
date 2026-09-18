import { lazy, Suspense } from 'react'
import type { GluuDatePickerProps } from './types'
import { isGluuDatePickerRangeProps } from './types'

// The MUI date pickers are ~55 kB gzipped and were reaching the eager bundle through the shared
// chunk, so they load on demand. The fallback reserves the field height to avoid a layout shift.
const DatePickerChild = lazy(() => import('./DatePickerChild'))

const FIELD_HEIGHT = 56
const RANGE_FIELD_GAP = 16

const GluuDatePickerFallback = (props: GluuDatePickerProps) => {
  const height = props.inputHeight ?? FIELD_HEIGHT

  if (!isGluuDatePickerRangeProps(props)) {
    return <div aria-busy="true" style={{ height, width: '100%' }} />
  }

  return (
    <div
      aria-busy="true"
      style={{ display: 'flex', flexWrap: 'wrap', gap: RANGE_FIELD_GAP, width: '100%' }}
    >
      <div style={{ flex: '1 1 0', minWidth: 0, height }} />
      <div style={{ flex: '1 1 0', minWidth: 0, height }} />
    </div>
  )
}

const GluuDatePicker = (props: GluuDatePickerProps) => (
  <Suspense fallback={<GluuDatePickerFallback {...props} />}>
    <DatePickerChild {...props} />
  </Suspense>
)

GluuDatePicker.displayName = 'GluuDatePicker'

export { GluuDatePicker }
export default GluuDatePicker
