import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { themeConfig } from '@/context/theme/config'
import customColors from '@/customColors'

type ThemeColors = (typeof themeConfig)[keyof typeof themeConfig]

interface SettingsStylesParams {
  isDark: boolean
  themeColors: ThemeColors
}

export const useStyles = makeStyles<SettingsStylesParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const settings = themeColors.settings

  const customParamsBorder = isDark ? customColors.darkBorder : customColors.borderInput

  return {
    settingsCard: {
      backgroundColor: settings.cardBackground,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: '100%',
      minHeight: 480,
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    header: {
      paddingTop: `${SPACING.CONTENT_PADDING}px`,
      paddingLeft: `${SPACING.CONTENT_PADDING}px`,
      paddingRight: `${SPACING.CONTENT_PADDING}px`,
      paddingBottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      minHeight: 84,
    },
    headerTitle: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      margin: 0,
    },
    headerSubtitle: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.relaxed,
      color: themeColors.textMuted,
      margin: 0,
    },
    headerDivider: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      borderBottom: `1px solid ${themeColors.borderColor}`,
      zIndex: 0,
    },
    settingsLabels: {
      '& label, & label h5, & label .MuiSvgIcon-root': {
        color: `${themeColors.fontColor} !important`,
        fontFamily: fontFamily,
        fontSize: fontSizes.base,
        fontStyle: 'normal',
        fontWeight: fontWeights.semiBold,
        lineHeight: 'normal',
        letterSpacing: letterSpacing.normal,
      },
    },
    content: {
      paddingTop: `${SPACING.SECTION_GAP}px`,
      paddingLeft: `${SPACING.CONTENT_PADDING}px`,
      paddingRight: `${SPACING.CONTENT_PADDING}px`,
      paddingBottom: `${SPACING.CONTENT_PADDING}px`,
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.SECTION_GAP,
      [theme.breakpoints.down('sm')]: {
        paddingLeft: `${SPACING.PAGE}px`,
        paddingRight: `${SPACING.PAGE}px`,
      },
    },
    formSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.CARD_GAP,
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      columnGap: SPACING.CARD_GAP,
      rowGap: SPACING.CARD_GAP,
      width: '100%',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
    fieldItem: {
      width: '100%',
    },
    fieldItemFullWidth: {
      width: '100%',
      gridColumn: '1 / -1',
    },
    formWithInputs: {
      '& input, & select': {
        backgroundColor: settings.formInputBackground,
        border: `1px solid ${settings.inputBorder}`,
        borderRadius: 6,
        color: themeColors.fontColor,
        padding: '8px 12px',
      },
      '& select': {
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '12px 8px',
        paddingRight: 36,
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='${(themeColors.fontColor ?? '#fff').replace(/#/g, '%23')}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
      },
      '& input:disabled': {
        backgroundColor: `${settings.formInputBackground} !important`,
        border: `1px solid ${settings.inputBorder} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: 1,
        cursor: 'not-allowed',
      },
      '& select:disabled': {
        backgroundColor: `${settings.formInputBackground} !important`,
        border: `1px solid ${settings.inputBorder} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: 1,
        cursor: 'not-allowed',
      },
      '& input::placeholder': {
        color: themeColors.textMuted,
      },
    },
    customParamsBox: {
      backgroundColor: settings.formInputBackground,
      borderRadius: BORDER_RADIUS.DEFAULT,
      border: `1px solid ${customParamsBorder}`,
      padding: `12px ${SPACING.CARD_PADDING}px ${SPACING.CARD_PADDING}px`,
      width: '100%',
      boxSizing: 'border-box',
    },
    customParamsBoxEmpty: {
      paddingBottom: 12,
    },
    customParamsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    customParamsHeaderEmpty: {
      marginBottom: 0,
    },
    customParamsTitle: {
      fontFamily: fontFamily,
      fontWeight: 600,
      fontSize: '15px',
      fontStyle: 'normal',
      lineHeight: 1.4,
      letterSpacing: letterSpacing.normal,
      color: themeColors.fontColor,
      margin: 0,
      padding: 0,
    },
    customParamsBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.CARD_CONTENT_GAP,
    },
    customParamsRow: {
      display: 'flex',
      gap: SPACING.CARD_CONTENT_GAP,
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    customParamsActionBtn: {
      minWidth: 156,
      width: 156,
      minHeight: '44px !important',
      height: '44px !important',
      gap: 8,
      flexShrink: 0,
    },
    customParamsInput: {
      'flex': '1 1 200px',
      'minWidth': 120,
      'minHeight': 44,
      'boxSizing': 'border-box',
      'backgroundColor': `${settings.cardBackground} !important`,
      'border': `1px solid ${customParamsBorder} !important`,
      'borderRadius': 6,
      'padding': '10px 12px',
      'color': themeColors.fontColor,
      '&::placeholder': {
        color: themeColors.textMuted,
      },
      '&:focus, &:active': {
        backgroundColor: `${settings.cardBackground} !important`,
        color: themeColors.fontColor,
        border: `1px solid ${customParamsBorder} !important`,
        outline: 'none',
        boxShadow: 'none',
      },
    },
    customParamsError: {
      color: themeColors.errorColor,
      fontSize: fontSizes.sm,
      marginTop: 4,
    },
  }
})
