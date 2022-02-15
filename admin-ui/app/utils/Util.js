export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getNewColor() {
  let colorsIngredients = '0123456789ABCDEF'
  let color = '#'
  for (var counter = 0; counter < 6; counter++) {
    color = color + colorsIngredients[Math.floor(Math.random() * 16)]
  }
  return color
}
