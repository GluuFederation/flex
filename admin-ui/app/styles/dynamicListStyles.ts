import { SPACING, BORDER_RADIUS, CEDARLING_CONFIG_SPACING, OPACITY } from '@/constants'
import { fontFamily, fontWeights, fontSizes, letterSpacing } from '@/styles/fonts'
import type { DynamicListColorOptions } from './types'

const BOX_TOP_PADDING = 12
const HEADER_MB = 16
const HEADER_GAP = 12
const INPUT_MIN_WIDTH = 120
const INPUT_FLEX = '1 1 200px'
const BTN_WIDTH = 156
const BTN_HEIGHT = 44
const BTN_GAP = 8

export const getDynamicListStyles = (colors: DynamicListColorOptions) => ({
  listBox: {
    'backgroundColor': colors.boxBg,
    'borderRadius': BORDER_RADIUS.SMALL,
    'border': `1px solid ${colors.borderColor}`,
    'padding': `${BOX_TOP_PADDING}px ${SPACING.CARD_PADDING}px ${SPACING.CARD_PADDING}px`,
    'width': '100%' as const,
    'boxSizing': 'border-box' as const,
    '& input, & input:focus, & input:active, & input:disabled': {
      backgroundColor: `${colors.inputBg} !important`,
      border: `1px solid ${colors.borderColor} !important`,
      borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
    },
  },
  listBoxEmpty: {
    paddingBottom: BOX_TOP_PADDING,
  },
  listHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: HEADER_MB,
    gap: HEADER_GAP,
  },
  listHeaderEmpty: {
    marginBottom: 0,
  },
  listTitle: {
    fontFamily: fontFamily,
    fontWeight: fontWeights.semiBold,
    fontSize: fontSizes.description,
    fontStyle: 'normal' as const,
    lineHeight: 1.4,
    letterSpacing: letterSpacing.normal,
    color: colors.fontColor,
    margin: 0,
    padding: 0,
  },
  listBody: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: SPACING.CARD_CONTENT_GAP,
  },
  listRow: {
    display: 'flex' as const,
    gap: SPACING.CARD_CONTENT_GAP,
    alignItems: 'center' as const,
    flexWrap: 'wrap' as const,
  },
  listInput: {
    'flex': INPUT_FLEX,
    'minWidth': INPUT_MIN_WIDTH,
    'minHeight': CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
    'boxSizing': 'border-box' as const,
    'backgroundColor': `${colors.inputBg} !important`,
    'border': `1px solid ${colors.borderColor} !important`,
    'borderRadius': BORDER_RADIUS.SMALL,
    'paddingTop': CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
    'paddingBottom': CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
    'paddingLeft': CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
    'paddingRight': CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
    'color': colors.fontColor,
    'fontFamily': fontFamily,
    'fontSize': fontSizes.base,
    '&::placeholder': {
      color: `${colors.textMuted} !important`,
      opacity: OPACITY.PLACEHOLDER,
    },
    '&:focus, &:active': {
      backgroundColor: `${colors.inputBg} !important`,
      color: colors.fontColor,
      border: `1px solid ${colors.borderColor} !important`,
      outline: 'none !important',
      boxShadow: 'none !important',
    },
    '&:focus-visible': {
      outline: 'none !important',
      boxShadow: 'none !important',
    },
  },
  listActionBtn: {
    '&&': {
      minWidth: BTN_WIDTH,
      width: BTN_WIDTH,
      minHeight: BTN_HEIGHT,
      height: BTN_HEIGHT,
      gap: BTN_GAP,
      flexShrink: 0,
    },
  },
  listError: {
    color: colors.errorColor,
    fontSize: fontSizes.sm,
    marginTop: 4,
  },
})
