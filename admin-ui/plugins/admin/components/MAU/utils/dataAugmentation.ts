import { type Dayjs } from 'dayjs'
import type { MauStatEntry, RawStatEntry } from '../types'

export function formatDateForApi(date: Dayjs): string {
  return date.format('YYYYMM')
}

export function generateMonthRange(startDate: Dayjs, endDate: Dayjs): number[] {
  const months: number[] = []
  let current = startDate.startOf('month')
  const end = endDate.startOf('month')

  while (current.isBefore(end) || current.isSame(end, 'month')) {
    months.push(Number.parseInt(current.format('YYYYMM'), 10))
    current = current.add(1, 'month')
  }

  return months
}

export function transformRawStatEntry(raw: RawStatEntry): MauStatEntry {
  return {
    month: raw.month ?? 0,
    mau: raw.monthly_active_users ?? 0,
    client_credentials_access_token_count:
      raw.token_count_per_granttype?.client_credentials?.access_token ?? 0,
    authz_code_access_token_count:
      raw.token_count_per_granttype?.authorization_code?.access_token ?? 0,
    authz_code_idtoken_count: raw.token_count_per_granttype?.authorization_code?.id_token ?? 0,
  }
}

export function createEmptyStatEntry(month: number): MauStatEntry {
  return {
    month,
    mau: 0,
    client_credentials_access_token_count: 0,
    authz_code_access_token_count: 0,
    authz_code_idtoken_count: 0,
  }
}

export function augmentMauData(
  data: MauStatEntry[],
  startDate: Dayjs,
  endDate: Dayjs,
): MauStatEntry[] {
  if (!data || data.length === 0) {
    const allMonths = generateMonthRange(startDate, endDate)
    return allMonths.map(createEmptyStatEntry)
  }

  const existingMonths = new Set(data.map((entry) => entry.month))
  const allMonths = generateMonthRange(startDate, endDate)
  const augmented = [...data]

  for (const month of allMonths) {
    if (!existingMonths.has(month)) {
      augmented.push(createEmptyStatEntry(month))
    }
  }

  return augmented.sort((a, b) => a.month - b.month)
}
