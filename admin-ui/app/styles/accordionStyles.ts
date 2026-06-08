import { BORDER_RADIUS, SPACING } from '@/constants'
import customColors, { hexToRgb } from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'

export const getAccordionStyles = (
  isDark: boolean,
  themeColors: ThemeConfig,
  fontColor: string,
  formInputBg: string,
  inputBorderColor: string,
) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const accordionBorderColor = isDark
    ? `rgba(${hexToRgb(customColors.darkBorderGradientBase)}, 0.35)`
    : inputBorderColor
  const accordionHeaderBg = isDark ? customColors.darkInputBg : themeColors.inputBackground

  return {
    '& .card.b-primary': {
      border: `1px solid ${accordionBorderColor} !important`,
      borderRadius: BORDER_RADIUS.ACCORDION,
      overflow: 'visible',
      marginBottom: `${SPACING.CARD_CONTENT_GAP}px`,
      backgroundColor: `${cardBg} !important`,
      boxShadow: 'none !important',
    },
    '& .card.b-primary > .card-header': {
      backgroundColor: `${accordionHeaderBg} !important`,
      borderBottom: 'none !important',
      borderTop: 'none !important',
      borderRadius: `${BORDER_RADIUS.ACCORDION}px ${BORDER_RADIUS.ACCORDION}px 0 0`,
      padding: '12px 20px',
      fontSize: '15px',
      fontWeight: 600,
      color: `${fontColor} !important`,
      cursor: 'pointer',
    },
    '& .card.b-primary:has(> .MuiCollapse-hidden) > .card-header': {
      borderBottom: 'none !important',
      borderRadius: BORDER_RADIUS.ACCORDION,
    },
    '& .card.b-primary > .card-header span': {
      color: `${fontColor} !important`,
    },
    '& .card.b-primary .card-body': {
      backgroundColor: `${cardBg} !important`,
      color: `${fontColor} !important`,
      padding: `${SPACING.SECTION_GAP}px ${SPACING.CARD_PADDING}px !important`,
      borderRadius: `0 0 ${BORDER_RADIUS.ACCORDION}px ${BORDER_RADIUS.ACCORDION}px`,
    },
    '& .card.b-primary .form-control:not(.MuiInputBase-input), & .card.b-primary input:not(.MuiInputBase-input), & .card.b-primary select, & .card.b-primary textarea':
      {
        backgroundColor: `${formInputBg} !important`,
      },
  }
}
