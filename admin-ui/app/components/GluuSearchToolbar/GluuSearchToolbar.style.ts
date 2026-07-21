import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights, letterSpacing } from '@/styles/fonts'
import {
  BORDER_RADIUS,
  FILTER_SHEET,
  INPUT,
  ICON_SIZE,
  MOBILE_MEDIA_QUERY,
  OPACITY,
  TABLET_COLLAPSE_BAND_MEDIA_QUERY,
  TOOLBAR,
} from '@/constants'

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
  const accentColor = themeColors.badges?.filledBadgeBg ?? themeColors.fontColor

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
    mobileRow: {
      display: 'flex',
      alignItems: 'center',
      gap: BORDER_RADIUS.SMALL * 2,
      width: '100%',
    },
    mobileInput: {
      'flex': 1,
      'minWidth': 0,
      'height': inputHeightPx,
      'padding': `0 ${INPUT.PADDING_HORIZONTAL}px`,
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
      '&:focus, &:focus-visible': {
        outline: 'none',
        boxShadow: 'none',
        borderColor: inputBorder,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: OPACITY.DISABLED,
      },
    },
    mobileTrigger: {
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'flexShrink': 0,
      'width': ICON_SIZE.LG,
      'height': ICON_SIZE.LG,
      'padding': 0,
      'border': 'none',
      'background': 'transparent',
      'cursor': 'pointer',
      'color': inputColor,
      '& svg': {
        fontSize: ICON_SIZE.LG,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: OPACITY.DISABLED,
      },
    },
    sheetContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: FILTER_SHEET.GROUP_GAP,
      padding: `${FILTER_SHEET.TITLE_TO_GROUP}px ${FILTER_SHEET.PADDING_X}px ${FILTER_SHEET.BODY_PADDING_BOTTOM}px`,
    },
    sheetGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    sheetLabel: {
      display: 'block',
      fontFamily,
      fontSize: fontSizes.description,
      fontWeight: fontWeights.semiBold,
      lineHeight: 'normal',
      letterSpacing: '0.3px',
      color: themeColors.fontColor,
      margin: `0 0 ${FILTER_SHEET.GROUP_LABEL_MB}px`,
    },
    sheetPills: {
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: FILTER_SHEET.PILL_GAP,
      rowGap: FILTER_SHEET.PILL_ROW_GAP,
    },
    sheetPill: {
      fontFamily,
      fontSize: fontSizes.pill,
      fontWeight: fontWeights.medium,
      lineHeight: FILTER_SHEET.PILL_LINE_HEIGHT,
      letterSpacing: '0.15px',
      color: themeColors.fontColor,
      backgroundColor: 'transparent',
      border: `${FILTER_SHEET.PILL_BORDER_WIDTH}px solid ${themeColors.borderColor}`,
      borderRadius: FILTER_SHEET.PILL_RADIUS,
      padding: `${FILTER_SHEET.PILL_PADDING_Y}px ${FILTER_SHEET.PILL_PADDING_X}px`,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    sheetPillSelected: {
      color: accentColor,
      borderColor: accentColor,
    },
    sheetActions: {
      display: 'flex',
      flexDirection: 'column',
      gap: FILTER_SHEET.PILL_ROW_GAP,
    },
    sheetButtonRow: {
      'display': 'flex',
      'gap': FILTER_SHEET.BUTTONS_GAP,
      'marginTop': FILTER_SHEET.BUTTONS_MT,
      '& > *': {
        flex: '1 1 0',
        minWidth: 0,
      },
    },
    sheetButtonIcon: {
      fontSize: ICON_SIZE.SM,
    },
    fieldGroup: {
      'display': 'flex',
      'flexDirection': 'column',
      'gap': BORDER_RADIUS.SMALL,
      'minWidth': 0,
      '@media (max-width: 1200px)': {
        flex: '0 1 auto',
        minWidth: TOOLBAR.CONTROL_WIDTH,
      },
      [`@media ${TABLET_COLLAPSE_BAND_MEDIA_QUERY}`]: {
        flex: '1 1 0',
        minWidth: 0,
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        flex: '1 1 100%',
        minWidth: 0,
      },
    },
    fieldGroupSearch: {
      'display': 'flex',
      'flexDirection': 'column',
      'gap': BORDER_RADIUS.SMALL,
      ...(searchFieldWidth != null
        ? { width: searchFieldWidth, flex: '0 0 auto' as const }
        : { flex: 1, minWidth: TOOLBAR.SEARCH_MIN_WIDTH }),
      '@media (max-width: 1200px)': {
        flex: '2 1 45%',
        minWidth: TOOLBAR.SEARCH_MIN_WIDTH,
      },
      [`@media ${TABLET_COLLAPSE_BAND_MEDIA_QUERY}`]: {
        flex: '1 1 100%',
        minWidth: 0,
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        flex: '1 1 100%',
        minWidth: 0,
      },
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
      '&:focus, &:focus-visible': {
        outline: 'none',
        boxShadow: 'none',
        borderColor: inputBorder,
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
      maxWidth: '100%',
    },
    filterSelect: {
      'height': inputHeightPx,
      'padding': `0 36px 0 ${INPUT.PADDING_HORIZONTAL}px`,
      'border': `1px solid ${inputBorder}`,
      'borderRadius': BORDER_RADIUS.SMALL,
      'backgroundColor': inputBg,
      'color': inputColor,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.medium,
      fontFamily,
      'cursor': 'pointer',
      'outline': 'none',
      'appearance': 'none',
      'WebkitAppearance': 'none',
      'MozAppearance': 'none',
      'boxSizing': 'border-box',
      'width': '100%',
      '&:focus, &:focus-visible': {
        outline: 'none',
        boxShadow: 'none',
        borderColor: inputBorder,
      },
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
      'height': inputHeightPx,
      'padding': '0 12px',
      'border': `1px solid ${inputBorder}`,
      'borderRadius': BORDER_RADIUS.SMALL,
      'backgroundColor': inputBg,
      'color': inputColor,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.medium,
      fontFamily,
      'outline': 'none',
      'boxSizing': 'border-box',
      'width': 255,
      '&:focus, &:focus-visible': {
        outline: 'none',
        boxShadow: 'none',
        borderColor: inputBorder,
      },
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
    actionsGroup: {
      'display': 'flex',
      'flexDirection': 'column',
      'gap': BORDER_RADIUS.SMALL,
      'marginLeft': 'auto',
      'minWidth': 0,
      '@media (max-width: 1200px)': {
        marginLeft: 0,
        flex: '0 0 auto',
      },
      [`@media ${TABLET_COLLAPSE_BAND_MEDIA_QUERY}`]: {
        flex: '2 1 0',
        minWidth: 0,
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        flex: '1 1 100%',
      },
    },
    buttonGroup: {
      'display': 'flex',
      'gap': 10,
      'alignItems': 'flex-end',
      'position': 'relative',
      'zIndex': 20,
      'pointerEvents': 'auto',
      'isolation': 'isolate',
      'flexWrap': 'wrap',
      [`@media ${TABLET_COLLAPSE_BAND_MEDIA_QUERY}`]: {
        flexWrap: 'nowrap',
      },
      '@media (max-width: 1200px)': {
        justifyContent: 'flex-start',
      },
    },
    toolbarButton: {
      minWidth: TOOLBAR.CONTROL_WIDTH,
      flex: '0 0 auto',
      position: 'relative',
      zIndex: 20,
      pointerEvents: 'auto',
      [`@media ${TABLET_COLLAPSE_BAND_MEDIA_QUERY}`]: {
        'flex': '1 1 0',
        'minWidth': 0,
        'whiteSpace': 'nowrap',
        '& > span': {
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
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
