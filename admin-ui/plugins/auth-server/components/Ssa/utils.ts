import type { Dayjs } from 'dayjs'
import type { SsaFormValues, ExpirationDate } from './types'

export const getSsaInitialValues = (): SsaFormValues => ({
  software_id: '',
  one_time_use: true,
  org_id: '',
  description: '',
  software_roles: [],
  rotate_ssa: true,
  grant_types: [],
  is_expirable: false,
  expirationDate: null as ExpirationDate,
})

// Accepts a Dayjs object from MUI DatePicker and returns epoch seconds or null
export const toEpochSecondsFromDayjs = (dayjsValue: Dayjs | null): number | null => {
  try {
    if (!dayjsValue) {
      return null
    }
    const ms = dayjsValue.toDate().getTime()
    if (Number.isFinite(ms)) {
      return Math.floor(ms / 1000)
    }
    return null
  } catch {
    return null
  }
}
