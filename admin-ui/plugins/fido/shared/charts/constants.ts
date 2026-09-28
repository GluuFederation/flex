export const CHART_HEIGHT = {
  DESKTOP: 360,
  MOBILE: 180,
  COMPACT: 300,
  FULLSCREEN: 560,
} as const

export const MOBILE_CHART_GEOMETRY = {
  PIE_MARGIN: { top: 8, right: 26, bottom: 8, left: 26 },
  PIE_OUTER_RADIUS: '78%',
  PIE_LABEL_OFFSET: 16,
  PIE_LABEL_LINE_OFFSET: 8,
  PIE_LABEL_FONT_SIZE: 9,
  PIE_LABEL_LINE_GAP: 11,
  PIE_LABEL_LINE_TOP: 5.5,
  AXIS_WIDTH: 38,
  AXIS_FONT_SIZE: 9,
  TICK_FONT_SIZE: 10,
  TICK_MIN_GAP: 8,
  BAR_SIZE: 12,
  ONBOARDING_BAR_SIZE: 18,
  ONBOARDING_BAR_GAP: 2,
  LINE_MARGIN: { top: 12, right: 12, left: 0 },
  BAR_MARGIN: { top: 12, right: 12, left: 0 },
  LINE_MARGIN_FLUSH: { top: 12, right: 0, left: 0 },
  BAR_MARGIN_FLUSH: { top: 12, right: 0, left: 0 },
} as const

export const DESKTOP_CHART_GEOMETRY = {
  PIE_MARGIN: { top: 30, right: 110, bottom: 30, left: 110 },
  PIE_OUTER_RADIUS: '80%',
  PIE_LABEL_OFFSET: 36,
  PIE_LABEL_LINE_OFFSET: 22,
  PIE_LABEL_FONT_SIZE: 13,
  PIE_LABEL_LINE_GAP: 20,
  PIE_LABEL_LINE_TOP: 8,
  AXIS_WIDTH: 45,
  AXIS_FONT_SIZE: 12,
  TICK_FONT_SIZE: 12,
  TICK_MIN_GAP: 12,
  BAR_SIZE: 28,
  ONBOARDING_BAR_SIZE: 40,
  ONBOARDING_BAR_GAP: 4,
  LINE_MARGIN: { top: 20, right: 32, left: 10 },
  BAR_MARGIN: { top: 20, left: 10 },
  LINE_MARGIN_FLUSH: { top: 20, right: 0, left: 0 },
  BAR_MARGIN_FLUSH: { top: 20, right: 0, left: 0 },
} as const

export const CHART_ZOOM = { MIN: 1, MAX: 3, STEP: 0.25, DEFAULT: 1 } as const

export const RECHARTS_INITIAL_DIMENSION = { width: 100, height: 100 }

export const CHART_SCROLLBAR_GUTTER = 10

export const MODAL_COMPACT_MAX_HEIGHT = '80vh'

const MODAL_COMPACT_CHROME_HEIGHT = 180

export const getCompactFullscreenFrameHeight = (minHeight: number): string =>
  `max(${minHeight}px, calc(${MODAL_COMPACT_MAX_HEIGHT} - ${MODAL_COMPACT_CHROME_HEIGHT}px))`
