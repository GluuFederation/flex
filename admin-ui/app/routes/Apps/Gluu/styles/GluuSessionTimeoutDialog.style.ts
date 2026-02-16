import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

const DIALOG_BORDER_RADIUS = 16

const styles = makeStyles<{ themeColors: ThemeConfig; isDark: boolean }>()((
  theme,
  { themeColors, isDark },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: DIALOG_BORDER_RADIUS })

  return {
    dialog: {
      padding: theme.spacing(5),
      borderRadius: DIALOG_BORDER_RADIUS,
      width: 550,
      minHeight: 259,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor:
        themeColors.card?.background ?? themeColors.menu?.background ?? themeColors.background,
      backgroundImage: 'none',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'visible',
      ...cardBorderStyle,
    },
    titleWrapper: {
      paddingBottom: 0,
    },
    title: {
      fontFamily,
      fontSize: fontSizes['3xl'],
      fontStyle: 'normal',
      fontWeight: fontWeights.bold,
      lineHeight: '45px',
      color: themeColors.fontColor,
    },
    contentText: {
      fontFamily,
      fontSize: fontSizes.content,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.base,
      letterSpacing: letterSpacing.content,
      color: themeColors.textMuted,
      marginBottom: theme.spacing(0.5),
    },
    contentWrapper: {
      marginBottom: theme.spacing(1),
    },
    actionArea: {
      padding: theme.spacing(0.5, 0),
      justifyContent: 'flex-start',
      gap: theme.spacing(1),
      marginTop: 0,
    },
    button: {
      textTransform: 'none',
      padding: theme.spacing(1, 4),
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '16px',
      fontWeight: 600,
    },
    logout: {
      borderRadius: 8,
      color: themeColors.formFooter?.back?.textColor,
      backgroundColor: themeColors.formFooter?.back?.backgroundColor,
      borderColor: themeColors.formFooter?.back?.backgroundColor,
    },
    continue: {
      'borderRadius': 6,
      'border': `1px solid ${themeColors.formFooter?.cancel?.borderColor ?? themeColors.borderColor}`,
      fontFamily,
      'fontSize': fontSizes.base,
      'fontStyle': 'normal',
      'fontWeight': fontWeights.bold,
      'lineHeight': lineHeights.normal,
      'letterSpacing': letterSpacing.button,
      'color': themeColors.formFooter?.cancel?.textColor ?? themeColors.fontColor,
      'backgroundColor': themeColors.formFooter?.cancel?.backgroundColor ?? 'transparent',
      '&:hover': {
        color: themeColors.formFooter?.cancel?.textColor ?? themeColors.fontColor,
        backgroundColor: themeColors.formFooter?.cancel?.backgroundColor ?? 'transparent',
        borderColor: themeColors.formFooter?.cancel?.borderColor ?? themeColors.borderColor,
      },
    },
  }
})

export default styles
