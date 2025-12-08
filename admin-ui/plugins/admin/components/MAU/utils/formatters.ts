import { MONTH_NAMES } from '../constants'

export function formatMonth(yyyymm: number): string {
  const str = yyyymm.toString()
  if (str.length !== 6) return str
  const year = str.substring(0, 4)
  const monthIndex = parseInt(str.substring(4, 6), 10) - 1
  const monthName = MONTH_NAMES[monthIndex] ?? ''
  return `${monthName} ${year}`
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toLocaleString()
}

export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return ((current - previous) / previous) * 100
}

export function formatPercentChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}
