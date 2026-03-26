import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights, letterSpacing } from '@/styles/fonts'
import { BORDER_RADIUS, INPUT, ICON_SIZE, OPACITY, TOOLBAR } from '@/constants'

export const DEFAULT_INPUT_HEIGHT = INPUT.HEIGHT

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
      gap: 10,
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
      gap: BORDER_RADIUS.SMALL,
      minWidth: 0,
    },
    fieldGroupSearch: {
      display: 'flex',
      flexDirection: 'column',
      gap: BORDER_RADIUS.SMALL,
      ...(searchFieldWidth != null
        ? { width: searchFieldWidth, flex: '0 0 auto' as const }
        : { flex: 1, minWidth: TOOLBAR.SEARCH_MIN_WIDTH }),
    },
    fieldLabel: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.semiBold,
      color: themeColors.fontColor,
      letterSpacing: letterSpacing.normal,
    },
    searchWrapper: {
      position: 'relative',
      width: '100%',
    },
    searchInput: {
      'width': '100%',
      'height': inputHeightPx,
      'padding': `0 12px 0 ${INPUT.PADDING_LEFT_WITH_ICON}px`,
      'border': `1px solid ${inputBorder}`,
      'borderRadius': BORDER_RADIUS.SMALL,
      'backgroundColor': inputBg,
      'color': inputColor,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.medium,
      fontFamily,
      'outline': 'none',
      'boxSizing': 'border-box',
      '&::placeholder': {
        color: inputColor,
        opacity: OPACITY.PLACEHOLDER,
      },
    },
    searchInputDisabled: {
      opacity: OPACITY.DISABLED,
      cursor: 'not-allowed',
    },
    searchIcon: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      display: 'flex',
      color: inputColor,
    },
    searchIconSvg: {
      fontSize: ICON_SIZE.MD,
      color: 'inherit',
    },
    filterSelectWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      color: inputColor,
      width: '100%',
    },
    filterSelect: {
      height: inputHeightPx,
      padding: `0 36px 0 ${INPUT.PADDING_HORIZONTAL}px`,
      border: `1px solid ${inputBorder}`,
      borderRadius: BORDER_RADIUS.SMALL,
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
      width: '100%',
    },
    filterSelectChevron: {
      position: 'absolute',
      right: INPUT.CHEVRON_RIGHT,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      display: 'flex',
    },
    dateInput: {
      height: inputHeightPx,
      padding: '0 12px',
      border: `1px solid ${inputBorder}`,
      borderRadius: BORDER_RADIUS.SMALL,
      backgroundColor: inputBg,
      color: inputColor,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      fontFamily,
      outline: 'none',
      boxSizing: 'border-box',
      width: 255,
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
      gap: 10,
      alignItems: 'flex-end',
      marginLeft: 'auto',
      position: 'relative',
      zIndex: 20,
      pointerEvents: 'auto',
      isolation: 'isolate',
    },
    toolbarButton: {
      minWidth: TOOLBAR.MIN_WIDTH,
      position: 'relative',
      zIndex: 20,
      pointerEvents: 'auto',
    },
    validationRow: {
      width: '100%',
      marginTop: BORDER_RADIUS.SMALL,
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
