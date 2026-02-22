import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

export const DEFAULT_INPUT_HEIGHT = 52

interface GluuSearchToolbarStyleParams {
  themeColors: ThemeConfig
  isDark: boolean
  searchFieldWidth?: number | string
}

export const useStyles = makeStyles<GluuSearchToolbarStyleParams>()((
  _,
  { themeColors, isDark, searchFieldWidth },
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
      ...(searchFieldWidth != null
        ? { width: searchFieldWidth, flex: '0 0 auto' as const }
        : { flex: 1, minWidth: '220px' }),
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
        opacity: 0.6,
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
    searchIconSvg: {
      fontSize: 20,
      color: 'inherit',
    },
    filterSelectWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      color: inputColor,
    },
    filterSelect: {
      height: inputHeightPx,
      padding: '0 36px 0 20px',
      border: `1px solid ${inputBorder}`,
      borderRadius: '6px',
      backgroundColor: inputBg,
      color: inputColor,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      fontFamily,
      cursor: 'pointer',
      outline: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      boxSizing: 'border-box',
    },
    filterSelectChevron: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      display: 'flex',
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
