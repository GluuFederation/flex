import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/config'

export const OPACITY = {
  // Hover interactions
  HOVER_LIGHT: 0.04,
  HOVER_DARK: 0.08, // shared: also list-hover light
  LIST_HOVER_DARK: 0.12,
  // Error states
  ERROR_BG_LIGHT: 0.06,
  ERROR_BG_DARK: 0.15,
  // Structural
  DIVIDER_LIGHT: 0.18,
  DIVIDER_DARK: 0.25, // shared: also error-border light
  STRONG: 0.4,
  // UI states
  NONE: 0,
  DISABLED: 0.5,
  PLACEHOLDER: 0.6, // shared: also loading overlay light
  OVERLAY: 0.8,
  FULL: 1,
} as const

export const getHoverOpacity = (isDark: boolean): number => {
  return isDark ? OPACITY.HOVER_DARK : OPACITY.HOVER_LIGHT
}

export const getListHoverOpacity = (isDark: boolean): number => {
  return isDark ? OPACITY.LIST_HOVER_DARK : OPACITY.HOVER_DARK
}

export const getDividerOpacity = (isDark: boolean): number => {
  return isDark ? OPACITY.DIVIDER_DARK : OPACITY.DIVIDER_LIGHT
}

export const getErrorBgOpacity = (isDark: boolean): number => {
  return isDark ? OPACITY.ERROR_BG_DARK : OPACITY.ERROR_BG_LIGHT
}

export const getErrorBorderOpacity = (isDark: boolean): number => {
  return isDark ? OPACITY.STRONG : OPACITY.DIVIDER_DARK
}

export const getLoadingOverlayOpacity = (isDark: boolean): number => {
  return isDark ? OPACITY.STRONG : OPACITY.PLACEHOLDER
}

export const SCROLLBAR = {
  WIDTH: 4,
  HEIGHT: 4,
  BORDER_RADIUS: 4,
} as const

export const MOBILE_BOTTOM_NAV_HEIGHT = 64

export const MOBILE_MEDIA_QUERY = '(max-width:767px)'

export const SMALL_MAX_MEDIA_QUERY = '(max-width:575.98px)'

export const EXTRA_SMALL_MAX_MEDIA_QUERY = '(max-width:480px)'

export const TINY_MAX_MEDIA_QUERY = '(max-width:379.98px)'

export const TABLET_MAX_MEDIA_QUERY = '(max-width:1024px)'

export const NAVBAR_TITLE_LG_MEDIA_QUERY = '(max-width:1200px)'

export const NAVBAR_TITLE_MD_MEDIA_QUERY = '(max-width:992px)'

export const WIDE_MAX_MEDIA_QUERY = '(max-width:1400px)'

export const TABLET_BAND_MEDIA_QUERY = '(min-width:768px) and (max-width:1024px)'

export const TABLET_COLLAPSE_BAND_MEDIA_QUERY = '(min-width:768px) and (max-width:991.98px)'

export const DESKTOP_NARROW_MEDIA_QUERY = '(min-width:1025px) and (max-width:1140px)'

export const STATUS_GRID_MEDIA_QUERY = '(min-width:1025px) and (max-width:1199.98px)'

export const MOBILE_PAGE_PADDING_X = {
  MD: 20,
  SM: 15,
} as const

export const NAVBAR_DESKTOP_PADDING_X = 60

export const DESKTOP_MIN_MEDIA_QUERY = '(min-width:992px)'

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
  CONTENT_PADDING: 20,
  SECTION_GAP: 24,
  CARD_GAP: 24,
  CARD_PADDING: 24,
  CARD_BUTTON_GAP: 16,
  CARD_CONTENT_GAP: 8,
  FORM_FOOTER_GAP: 30,
} as const

export const MOBILE_SHEET_HEIGHT_VAR = '--mobile-sheet-height'

export const BORDER_RADIUS = {
  DEFAULT: 16,
  LARGE: 24,
  MOBILE_SHEET: 20,
  MEDIUM: 14,
  MEDIUM_SMALL: 12,
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

export const ICON_BUTTON_SIZE = 32

export const TOGGLE = {
  TRACK_WIDTH: 50,
  TRACK_HEIGHT: 24,
  TRACK_RADIUS: 30,
  THUMB_SIZE: 22,
  THUMB_INSET: 1,
  THUMB_CHECKED_LEFT: 27,
  ICON_HEIGHT: 10,
  CHECK_WIDTH: 14,
  CHECK_LEFT: 8,
  X_WIDTH: 10,
  X_RIGHT: 10,
  FOCUS_RING_BLUR: 2,
  FOCUS_RING_SPREAD: 3,
  ACTIVE_RING_BLUR: 5,
  ACTIVE_RING_SPREAD: 5,
} as const

export const TOOLTIP = {
  ARROW_SIZE: 8,
  PADDING_VERTICAL: 8,
  PADDING_HORIZONTAL: 16,
  BORDER_RADIUS: 3,
  OFFSET: 10,
  FONT_SIZE: '90%',
} as const

export const TOOLBAR = {
  MIN_WIDTH: 130,
  SEARCH_MIN_WIDTH: 220,
  CONTROL_WIDTH: 180,
  TIGHT_BUTTON_FONT_SIZE: 11,
  TIGHT_BUTTON_ICON_SIZE: 14,
  TIGHT_BUTTON_PADDING_Y: 8,
  TIGHT_BUTTON_PADDING_X: 8,
  TIGHT_BUTTON_GAP: 4,
  TIGHT_BUTTON_LINE_HEIGHT: 1.2,
} as const

export const FILTER_POPOVER = {
  WIDTH: 480,
} as const

export const FILTER_SHEET = {
  PADDING_X: 28,
  HEADER_PADDING_X: 18,
  HEADER_HEIGHT: 35,
  HEADER_PADDING_TOP: 24,
  CLOSE_SIZE: 22,
  CLOSE_TOP: 13,
  CLOSE_RIGHT: 18,
  TITLE_TO_GROUP: 22,
  GROUP_LABEL_MB: 14,
  GROUP_GAP: 24,
  PILLS_MAX_HEIGHT: 600,
  PILLS_SCROLL_PADDING_RIGHT: 4,
  PILL_GAP: 8,
  PILL_ROW_GAP: 10,
  PILL_PADDING_X: 15,
  PILL_PADDING_Y: 10,
  PILL_RADIUS: 6,
  PILL_BORDER_WIDTH: 1,
  PILL_LINE_HEIGHT: '18px',
  BUTTONS_GAP: 10,
  BUTTONS_MT: 28,
  BUTTON_HEIGHT: 52,
  BUTTON_RADIUS: 6,
  BODY_PADDING_BOTTOM: 24,
  FIELD_LABEL_MB: 9,
  FIELD_GROUP_GAP: 22,
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
  MOBILE_CONTENT_PADDING_LEFT: 18,
  MOBILE_DROPZONE_MIN_HEIGHT: 108,
  MOBILE_STEPS_TO_LABEL: 24,
  MOBILE_ALERT_PADDING_LEFT: 42,
  MOBILE_ALERT_PADDING_RIGHT: 16,
  MOBILE_ALERT_ICON_LEFT: 10,
} as const

export const MAPPING_SPACING = {
  PAGE_PADDING_TOP: 53,
  ALERT_TO_CARD: 24,
  TITLE_TO_SUBTITLE: 16,
  HEADER_TO_INFO: 20,
  CARD_PADDING: 33,
  CARD_HEADER_HEIGHT: 56,
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

export const createMobilePageTitleStyle = (fontColor: string) => ({
  display: 'none' as const,
  [`@media ${MOBILE_MEDIA_QUERY}`]: {
    display: 'block' as const,
    fontFamily,
    fontSize: fontSizes.pageTitle,
    fontStyle: 'normal' as const,
    fontWeight: fontWeights.bold,
    lineHeight: 'normal' as const,
    color: fontColor,
    margin: 0,
    marginBottom: SPACING.PAGE,
  },
})
