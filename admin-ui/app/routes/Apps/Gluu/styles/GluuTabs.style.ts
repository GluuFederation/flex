import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { BORDER_RADIUS } from '@/constants'

interface GluuTabsStyleParams {
  isDark: boolean
  themeColors: ThemeConfig
}

const TAB_INDICATOR_HEIGHT = 3

export const useStyles = makeStyles<GluuTabsStyleParams>()((_theme, { isDark, themeColors }) => {
  const inactiveTabColor = isDark ? customColors.lightBlue : themeColors.textMuted
  const activeTabColor = themeColors.badges.statusActive

  return {
    root: {
      width: '100%',
    },
    tabsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    tabsScrollable: {
      flex: 1,
      minWidth: 0,
    },
    tabsRightAction: {
      flexShrink: 0,
      marginLeft: 16,
    },
    tabs: {
      '& .MuiTab-root': {
        color: inactiveTabColor,
        fontFamily: fontFamily,
        fontSize: fontSizes.base,
        fontWeight: fontWeights.medium,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.normal,
        textTransform: 'none',
      },
      '& .MuiTab-root.Mui-selected': {
        color: activeTabColor,
        fontWeight: fontWeights.semiBold,
        background: activeTabColor,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        position: 'relative',
      },
      '& .MuiTabs-indicator': {
        background: activeTabColor,
        height: TAB_INDICATOR_HEIGHT,
        borderRadius: BORDER_RADIUS.THIN,
        boxShadow: `0 2px 4px ${activeTabColor}`,
      },
    },
  }
})
