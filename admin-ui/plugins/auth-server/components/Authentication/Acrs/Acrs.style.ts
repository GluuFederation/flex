import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { ICON_SIZE, SPACING } from '@/constants'
import { fontFamily, lineHeights } from '@/styles/fonts'

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
    borderRadius: '50%',
    backgroundColor: themeColors.badges.statusActive,
    flexShrink: 0 as const,
  },
  defaultInnerIcon: {
    color: '#ffffff !important',
    fontSize: '12px',
    width: '12px',
    height: '12px',
    flexShrink: 0 as const,
  },
}))
