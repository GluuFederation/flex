// @ts-nocheck
export function uuidv4() {
  // Use Web Crypto API if available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Predefined color palette for consistent colors
const colorPalette = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
]

export function getNewColor(index = 0) {
  // Use modulo to cycle through the palette
  return colorPalette[index % colorPalette.length]
}

export const getClientScopeByInum = (str) => {
  const inum = str.split(',')[0]
  const value = inum.split('=')[1]
  return value
}

export function getYearMonth(date) {
  return date.getFullYear() + getMonth(date)
}

export function getMonth(aDate) {
  const value = String(aDate.getMonth() + 1)
  if (value.length > 1) {
    return value
  } else {
    return '0' + value
  }
}

export function formatDate(date) {
  if (!date) {
    return '-'
  }
  if (date.length > 10) {
    return date.substring(0, 10)
  }
  if(date.length == 10) {
    return date
  }
  return '-'
}