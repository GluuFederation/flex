export const createTextWrapStyles = () => ({
  minWidth: 0,
  overflowWrap: 'anywhere' as const,
  wordBreak: 'break-word' as const,
})

export const createShrinkableGridStyles = (count: number) => ({
  gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
})
