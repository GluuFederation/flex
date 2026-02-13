import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily } from '@/styles/fonts'

const useStyles = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({
    isDark,
    borderRadius: BORDER_RADIUS.DEFAULT,
  })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

  return {
    page: {
      fontFamily,
    },
    searchCard: {
      width: '100%',
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: `${SPACING.CARD_PADDING}px 20px`,
      marginBottom: `${SPACING.CARD_GAP}px`,
      position: 'relative',
      zIndex: 0,
      overflow: 'visible',
      boxSizing: 'border-box',
    },
    searchCardContent: {
      position: 'relative',
      zIndex: 2,
      isolation: 'isolate',
      pointerEvents: 'auto',
    },
    tableCard: {
      'width': '100%',
      'maxWidth': '100%',
      'minWidth': 0,
      'backgroundColor': cardBg,
      ...cardBorderStyle,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'padding': `${SPACING.CARD_PADDING}px`,
      'position': 'relative',
      'overflowX': 'auto',
      'overflowY': 'visible',
      'boxSizing': 'border-box',
      '& table': {
        minWidth: 0,
      },
      '& table td': {
        verticalAlign: 'middle',
        minWidth: 0,
        lineHeight: '28px',
      },
      '& table th': {
        verticalAlign: 'middle',
        lineHeight: '28px',
      },
      '& table th:nth-child(1), & table td:not([data-divider-cell]):nth-child(1)': {
        padding: '14px 8px',
      },
      '& table th:nth-child(2), & table td:not([data-divider-cell]):nth-child(2)': {
        padding: '14px 16px',
      },
      '& table th:nth-child(3), & table td:not([data-divider-cell]):nth-child(3)': {
        padding: `14px ${SPACING.SECTION_GAP}px`,
      },
    },
    logEntryCell: {
      display: 'flex',
      alignItems: 'center',
      gap: `${SPACING.SECTION_GAP}px`,
      flexWrap: 'nowrap',
      minWidth: 0,
      lineHeight: '28px',
    },
    logEntryContent: {
      minWidth: 0,
      flex: 1,
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'pre-wrap',
    },
    logEntryContentCollapsed: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    dateBadge: {
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      lineHeight: 1,
      verticalAlign: 'middle',
    },
    searchActionIcon: {
      fontSize: 20,
    },
    accessTimeIcon: {
      fontSize: 16,
      flexShrink: 0,
    },
  }
})

export { useStyles }
