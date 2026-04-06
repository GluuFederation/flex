import type { ThemeConfig } from '@/context/theme/config'

export const OPACITY = {
  HOVER_LIGHT: 0.04,
  HOVER_DARK: 0.08,
  DISABLED: 0.5,
  PLACEHOLDER: 0.6,
  FULL: 1,
} as const

export const getHoverOpacity = (isDark: boolean): number => {
  return isDark ? OPACITY.HOVER_DARK : OPACITY.HOVER_LIGHT
}

export const SCROLLBAR = {
  WIDTH: 4,
  HEIGHT: 4,
  BORDER_RADIUS: 4,
} as const

export const getScrollbarStyles = (themeColors: ThemeConfig) => ({
  '&::-webkit-scrollbar': {
    width: SCROLLBAR.WIDTH,
    height: SCROLLBAR.HEIGHT,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: themeColors.card.background,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: themeColors.borderColor,
    borderRadius: SCROLLBAR.BORDER_RADIUS,
  },
  '&::-webkit-scrollbar-corner': {
    backgroundColor: themeColors.card.background,
  },
})

export const MODAL = {
  WIDTH: 1007,
  MAX_VW: '90vw',
  MAX_VH: '90vh',
} as const

export const SPACING = {
  PAGE: 24,
  CONTENT_PADDING: 40,
  SECTION_GAP: 24,
  CARD_GAP: 24,
  CARD_PADDING: 24,
  CARD_CONTENT_GAP: 8,
} as const

export const BORDER_RADIUS = {
  DEFAULT: 16,
  LARGE: 24,
  MEDIUM: 14,
  ACCORDION: 10,
  SMALL_MEDIUM: 8,
  SMALL: 6,
  CIRCLE: '50%',
  THIN: '1.5px',
} as const

export const GRADIENT_POSITION = {
  TOP_RIGHT: 'top right',
  TOP_LEFT: 'top left',
  BOTTOM_RIGHT: 'bottom right',
  BOTTOM_LEFT: 'bottom left',
  CENTER: 'center',
} as const

export const ELLIPSE_SIZE = '200% 160%'

export const INPUT = {
  HEIGHT: 52,
  PADDING_HORIZONTAL: 20,
  PADDING_LEFT_WITH_ICON: 40,
  CHEVRON_RIGHT: 14,
} as const

export const ICON_SIZE = {
  SM: 18,
  MD: 20,
  LG: 24,
} as const

export const TOOLBAR = {
  MIN_WIDTH: 130,
  SEARCH_MIN_WIDTH: 220,
} as const

export const FILTER_POPOVER = {
  WIDTH: 480,
} as const

export const CEDARLING_CONFIG_SPACING = {
  ALERT_TO_INPUT: 30,
  LABEL_MB: 7,
  DROPZONE_MIN_HEIGHT: 80,
  INPUT_HEIGHT: 52,
  INPUT_TO_RADIO: 44,
  RADIO_LABEL_MB: 8,
  HELPER_MT: 10,
  BUTTONS_MT: 50,
  ALERT_PADDING_TOP: 22,
  ALERT_PADDING_BOTTOM: 20,
  ALERT_PADDING_LEFT: 56,
  ALERT_PADDING_RIGHT: 24,
  ALERT_ICON_LEFT: 25,
  ALERT_ICON_TOP: 22,
  ALERT_TITLE_MB: 8,
  RADIO_GROUP_GAP: 25,
  INPUT_PADDING_VERTICAL: 14,
  INPUT_PADDING_HORIZONTAL: 21,
  BUTTON_OFFSET_TOP: 4,
  TOOLTIP_MAX_WIDTH: 320,
  ICON_SIZE_MD: 24,
} as const

export const MAPPING_SPACING = {
  PAGE_PADDING_TOP: 53,
  ALERT_TO_CARD: 24,
  CARD_PADDING: 33,
  CARD_HEADER_HEIGHT: 52,
  CARD_BORDER_RADIUS: 6,
  CARD_MARGIN_BOTTOM: 16,
  PERMISSION_ROW_GAP: 20,
  PERMISSION_ITEM_GAP: 30,
  CHECKBOX_SIZE: 22,
  CHECKBOX_LABEL_GAP: 9,
  CHECKBOX_BORDER_RADIUS: 5,
  CHECKBOX_BORDER_WIDTH: 2,
  CHECK_ICON_SIZE: 14,
  INFO_ALERT_PADDING_VERTICAL: 16,
  INFO_ALERT_PADDING_HORIZONTAL: 24,
  INFO_ALERT_GAP: 16,
  INFO_ALERT_BORDER_RADIUS: 6,
  INFO_ICON_SIZE: 24,
  CONTENT_PADDING_TOP: 27,
} as const
