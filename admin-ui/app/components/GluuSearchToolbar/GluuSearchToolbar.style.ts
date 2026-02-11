import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

export const DEFAULT_INPUT_HEIGHT = 52

interface GluuSearchToolbarStyleParams {
  themeColors: ThemeConfig
  isDark: boolean
}

export const useStyles = makeStyles<GluuSearchToolbarStyleParams>()((
  _,
  { themeColors, isDark },
) => {
  const inputBg = themeColors.inputBackground
  const inputBorder = isDark ? 'transparent' : themeColors.borderColor
  const inputColor = themeColors.fontColor

  const inputHeightPx = `${DEFAULT_INPUT_HEIGHT}px`
  return {
    container: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '10px',
      flexWrap: 'wrap',
      fontFamily,
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 5,
      pointerEvents: 'auto',
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      minWidth: 0,
    },
    fieldGroupSearch: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      flex: 1,
      minWidth: '220px',
    },
    fieldLabel: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.semiBold,
      color: themeColors.fontColor,
      letterSpacing: '0.3px',
    },
    searchWrapper: {
      position: 'relative',
      width: '100%',
    },
    searchInput: {
      'width': '100%',
      'height': inputHeightPx,
      'padding': '0 12px 0 40px',
      'border': `1px solid ${inputBorder}`,
      'borderRadius': '6px',
      'backgroundColor': inputBg,
      'color': inputColor,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.medium,
      fontFamily,
      'outline': 'none',
      'boxSizing': 'border-box',
      '&::placeholder': {
        color: inputColor,
        opacity: 1,
      },
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      display: 'flex',
      color: inputColor,
    },
    filterSelect: {
      height: inputHeightPx,
      padding: '0 12px',
      border: `1px solid ${inputBorder}`,
      borderRadius: '6px',
      backgroundColor: inputBg,
      color: inputColor,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      fontFamily,
      cursor: 'pointer',
      outline: 'none',
      appearance: 'auto',
      boxSizing: 'border-box',
    },
    dateInput: {
      height: inputHeightPx,
      padding: '0 12px',
      border: `1px solid ${inputBorder}`,
      borderRadius: '6px',
      backgroundColor: inputBg,
      color: inputColor,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      fontFamily,
      outline: 'none',
      boxSizing: 'border-box',
    },
    dateRangeSlot: {
      display: 'flex',
      alignItems: 'flex-end',
      flex: '1 1 auto',
      minWidth: 280,
      maxWidth: 520,
      position: 'relative',
      zIndex: 0,
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-end',
      marginLeft: 'auto',
      position: 'relative',
      zIndex: 20,
      pointerEvents: 'auto',
      isolation: 'isolate',
    },
    toolbarButton: {
      minWidth: 130,
      position: 'relative',
      zIndex: 20,
      pointerEvents: 'auto',
    },
    validationRow: {
      width: '100%',
      marginTop: 6,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    validationError: {
      fontSize: fontSizes.sm,
      padding: '0 4px',
      fontFamily,
      color: themeColors.errorColor,
    },
    validationWarning: {
      fontSize: fontSizes.sm,
      padding: '0 4px',
      fontFamily,
      color: themeColors.warningColor,
    },
  }
})
