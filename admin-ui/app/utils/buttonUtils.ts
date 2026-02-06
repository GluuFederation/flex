export const resolveBackgroundColor = (
  disableHoverStyles: boolean,
  keepBgOnHover: boolean,
  outlined: boolean,
  isHovered: boolean,
  isDisabled: boolean,
  bg: string,
  hoverBg: string,
): string => {
  if (disableHoverStyles || keepBgOnHover) {
    return bg
  }

  if (outlined) {
    if (isHovered && !isDisabled) {
      return `${bg}15`
    }
    return 'transparent'
  }

  if (isHovered && !isDisabled) {
    return hoverBg
  }

  return bg
}
