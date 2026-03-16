import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'

interface UserDetailViewPageStylesParams {
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<UserDetailViewPageStylesParams>()((_, { themeColors }) => {
  const tdPadding = 24 // GluuTable expandedPanel has padding: 16px 24px
  return {
    panel: {
      backgroundColor: 'transparent',
      width: '100%',
      boxSizing: 'border-box',
      paddingTop: 0,
      paddingBottom: 24,
      paddingLeft: 0,
      paddingRight: 0,
    },
    /** Full-width divider: break out of expanded td padding so it matches the row divider above */
    divider: {
      borderTop: `1px solid ${themeColors.borderColor}`,
      marginLeft: -tdPadding,
      marginRight: -tdPadding,
      width: `calc(100% + ${tdPadding * 2}px)`,
      marginBottom: 24,
      flexShrink: 0,
    },
    content: {
      paddingLeft: 28,
      paddingRight: 28,
    },
    grid: {
      'display': 'grid',
      'gridTemplateColumns': 'repeat(4, minmax(0, 1fr))',
      'gap': '20px 56px',
      '@media (max-width: 1200px)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      '@media (max-width: 720px)': {
        gridTemplateColumns: '1fr',
      },
    },
    field: {
      minWidth: 0,
    },
    label: {
      color: themeColors.fontColor,
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 700,
      marginBottom: 6,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    value: {
      color: themeColors.fontColor,
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 400,
      wordBreak: 'break-word',
    },
  }
})
