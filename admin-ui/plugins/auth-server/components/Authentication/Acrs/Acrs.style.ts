import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, ICON_SIZE, SPACING } from '@/constants'
import { fontFamily, fontSizes, lineHeights } from '@/styles/fonts'
import customColors from '@/customColors'

interface AcrsStylesParams {
  themeColors: ThemeConfig
}

const TABLE_LINE_HEIGHT = lineHeights.relaxed

export const useStyles = makeStyles<AcrsStylesParams>()((_, { themeColors }) => ({
  page: {
    'fontFamily': fontFamily,
    'width': '100%',
    'maxWidth': '100%',
    'minWidth': 0,
    'boxSizing': 'border-box' as const,
    'paddingTop': SPACING.CARD_CONTENT_GAP,
    '& table td': {
      verticalAlign: 'middle',
      minWidth: 0,
      lineHeight: TABLE_LINE_HEIGHT,
      wordBreak: 'break-all',
      overflowWrap: 'anywhere',
    },
    '& table th': {
      verticalAlign: 'middle',
      lineHeight: TABLE_LINE_HEIGHT,
    },
  },
  editIcon: {
    fontSize: ICON_SIZE.SM,
    color: themeColors.fontColor,
  },
  defaultIconCircle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_SIZE.LG,
    height: ICON_SIZE.LG,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: themeColors.badges.statusActive,
    flexShrink: 0 as const,
  },
  defaultInnerIcon: {
    color: `${customColors.white} !important`,
    fontSize: fontSizes.sm,
    width: fontSizes.sm,
    height: fontSizes.sm,
    flexShrink: 0 as const,
  },
}))
