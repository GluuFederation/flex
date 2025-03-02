export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getNewColor() {
  const colorsIngredients = '0123456789ABCDEF'
  let color = '#'
  for (let counter = 0; counter < 6; counter++) {
    color = color + colorsIngredients[Math.floor(Math.random() * 16)]
  }
  return color
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