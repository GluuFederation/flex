import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import customColors from '@/customColors'
import { SPACING, BORDER_RADIUS } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

interface SettingsStylesParams {
  isDark: boolean
}

export const useStyles = makeStyles<SettingsStylesParams>()((theme: Theme, { isDark }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })

  return {
    settingsCard: {
      backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
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
      color: isDark ? customColors.white : customColors.primaryDark,
      margin: 0,
    },
    headerSubtitle: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.relaxed,
      color: isDark ? customColors.textMutedDark : customColors.textSecondary,
      margin: 0,
    },
    headerDivider: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      borderBottom: `1px solid ${isDark ? customColors.darkBorder : customColors.lightBorder}`,
      zIndex: 0,
    },
    settingsLabels: {
      '& label, & label h5, & label .MuiSvgIcon-root': {
        color: `${isDark ? customColors.white : customColors.primaryDark} !important`,
        fontFamily: fontFamily,
        fontSize: '15px',
        fontStyle: 'normal',
        fontWeight: 600,
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
        backgroundColor: isDark ? customColors.darkInputBg : customColors.whiteSmoke,
        border: `1px solid ${isDark ? customColors.darkBorder : customColors.borderInput}`,
        borderRadius: 6,
        color: isDark ? customColors.white : customColors.primaryDark,
        padding: '8px 12px',
      },
      '& input:disabled': {
        backgroundColor: `${isDark ? customColors.darkInputBg : customColors.whiteSmoke} !important`,
        border: `1px solid ${isDark ? customColors.darkBorder : customColors.borderInput} !important`,
        color: `${isDark ? customColors.white : customColors.primaryDark} !important`,
        opacity: 1,
        cursor: 'not-allowed',
      },
      '& input::placeholder': {
        color: isDark ? customColors.textMutedDark : customColors.textSecondary,
      },
    },
    customParamsBox: {
      backgroundColor: isDark ? customColors.customParamsBoxDark : customColors.lightBackground,
      borderRadius: BORDER_RADIUS.DEFAULT,
      border: `1px solid ${isDark ? customColors.darkBorder : customColors.borderInput}`,
      padding: `${SPACING.CARD_PADDING}px`,
      width: '100%',
      boxSizing: 'border-box',
    },
    customParamsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.CARD_GAP,
    },
    customParamsTitle: {
      fontFamily: fontFamily,
      fontWeight: 600,
      fontSize: '15px',
      fontStyle: 'normal',
      lineHeight: 'normal',
      letterSpacing: letterSpacing.normal,
      color: isDark ? customColors.white : customColors.primaryDark,
      margin: 0,
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
    customParamsInput: {
      'flex': '1 1 200px',
      'minWidth': 120,
      'backgroundColor': isDark ? customColors.customParamsInputDark : customColors.white,
      'border': '1px solid transparent',
      'borderRadius': 6,
      'padding': '8px 12px',
      'color': isDark ? customColors.white : customColors.primaryDark,
      '&::placeholder': {
        color: isDark ? customColors.white : customColors.textSecondary,
      },
      '&:focus': {
        backgroundColor: isDark ? customColors.customParamsInputDark : customColors.white,
        color: isDark ? customColors.white : customColors.primaryDark,
        border: `1px solid ${isDark ? customColors.darkBorder : customColors.primaryDark}`,
        boxShadow: isDark ? '0 0 0 3px rgba(25, 63, 102, 0.6)' : '0 0 0 3px rgba(10, 37, 64, 0.3)',
      },
    },
    customParamsError: {
      color: customColors.accentRed,
      fontSize: fontSizes.sm,
      marginTop: 4,
    },
  }
})
