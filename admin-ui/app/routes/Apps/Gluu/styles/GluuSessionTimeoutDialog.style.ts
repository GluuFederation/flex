import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, MAPPING_SPACING } from '@/constants/ui'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

const DIALOG_BORDER_RADIUS = BORDER_RADIUS.DEFAULT

const styles = makeStyles<{ themeColors: ThemeConfig; isDark: boolean }>()((
  theme,
  { themeColors, isDark },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: DIALOG_BORDER_RADIUS })

  return {
    dialog: {
      ...cardBorderStyle,
      padding: theme.spacing(5),
      borderRadius: DIALOG_BORDER_RADIUS,
      width: 'min(550px, calc(100vw - 32px))',
      minHeight: 259,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor:
        themeColors.card?.background ?? themeColors.menu?.background ?? themeColors.background,
      backgroundImage: 'none',
      boxSizing: 'border-box',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1050,
      overflow: 'visible',
    },
    titleWrapper: {
      paddingBottom: 0,
    },
    title: {
      fontFamily,
      fontSize: fontSizes['3xl'],
      fontStyle: 'normal',
      fontWeight: fontWeights.semiBold,
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
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0.5, 0),
      justifyContent: 'flex-start',
      gap: theme.spacing(2),
      marginTop: 0,
    },
    button: {
      textTransform: 'none',
      padding: theme.spacing(1, 4),
      fontFamily,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semiBold,
    },
    logout: {
      borderRadius: BORDER_RADIUS.SMALL_MEDIUM,
      color: themeColors.formFooter?.back?.textColor,
      backgroundColor: themeColors.formFooter?.back?.backgroundColor,
      borderColor: themeColors.formFooter?.back?.backgroundColor,
    },
    continue: {
      'borderRadius': MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
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
