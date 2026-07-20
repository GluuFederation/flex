import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  FILTER_SHEET,
  ICON_SIZE,
  INPUT,
  MOBILE_MEDIA_QUERY,
  OPACITY,
  SPACING,
} from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { createSearchCardStyle } from '@/styles/searchCardStyle'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import customColors from '@/customColors'

const useStylesBase = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({
    isDark,
    borderRadius: BORDER_RADIUS.DEFAULT,
  })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  return {
    page: {
      fontFamily,
      paddingTop: SPACING.PAGE,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingBottom: `${SPACING.CONTENT_PADDING}px`,
        boxSizing: 'border-box',
      },
    },
    mobilePageTitle: {
      display: 'none',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        display: 'block',
        fontFamily,
        fontSize: '28px',
        fontStyle: 'normal',
        fontWeight: fontWeights.bold,
        lineHeight: 'normal',
        color: themeColors.fontColor,
        margin: 0,
        marginBottom: SPACING.PAGE,
      },
    },
    cellDisplayName: { color: themeColors.fontColor, fontWeight: 500 },
    cellUrl: {
      wordBreak: 'break-all',
      maxWidth: '350px',
      fontFamily,
      color: themeColors.fontColor,
    },
    statusBadge: { minWidth: 80 },
    httpMethodBadge: { width: 72, minWidth: 72, maxWidth: 72, boxSizing: 'border-box' },
    viewIcon: { fontSize: ICON_SIZE.SM },
    editIcon: { fontSize: ICON_SIZE.SM },
    deleteIcon: { fontSize: ICON_SIZE.SM },
    addIcon: { fontSize: ICON_SIZE.MD },
    searchCard: createSearchCardStyle({ cardBg, isDark }),
    searchCardContent: {
      position: 'relative',
      zIndex: 2,
      isolation: 'isolate',
      pointerEvents: 'auto',
    },
    mobileSearchRow: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
    },
    mobileSearchInput: {
      'flex': 1,
      'minWidth': 0,
      'height': INPUT.HEIGHT,
      'padding': `0 ${INPUT.PADDING_HORIZONTAL}px`,
      'border': `1px solid ${isDark ? 'transparent' : themeColors.borderColor}`,
      'borderRadius': BORDER_RADIUS.SMALL,
      'backgroundColor': themeColors.inputBackground,
      'color': themeColors.fontColor,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.medium,
      fontFamily,
      'outline': 'none',
      'boxSizing': 'border-box',
      '&::placeholder': {
        color: themeColors.fontColor,
        opacity: OPACITY.PLACEHOLDER,
      },
      '&:focus, &:focus-visible': {
        outline: 'none',
        boxShadow: 'none',
        borderColor: isDark ? 'transparent' : themeColors.borderColor,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: OPACITY.DISABLED,
      },
    },
    mobileFilterButton: {
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
      'color': themeColors.fontColor,
      '& svg': {
        fontSize: ICON_SIZE.LG,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: OPACITY.DISABLED,
      },
    },
    filterSheetContent: {
      padding: `${FILTER_SHEET.TITLE_TO_GROUP}px ${FILTER_SHEET.PADDING_X}px ${FILTER_SHEET.BODY_PADDING_BOTTOM}px`,
    },
    filterSheetLabel: {
      display: 'block',
      fontFamily,
      fontSize: fontSizes.description,
      fontWeight: fontWeights.semiBold,
      lineHeight: 'normal',
      letterSpacing: '0.3px',
      color: themeColors.fontColor,
      margin: `0 0 ${FILTER_SHEET.GROUP_LABEL_MB}px`,
    },
    filterSheetPills: {
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: FILTER_SHEET.PILL_GAP,
      rowGap: FILTER_SHEET.PILL_ROW_GAP,
    },
    filterSheetPill: {
      fontFamily,
      fontSize: fontSizes.pill,
      fontWeight: fontWeights.medium,
      lineHeight: FILTER_SHEET.PILL_LINE_HEIGHT,
      letterSpacing: '0.15px',
      color: themeColors.fontColor,
      backgroundColor: 'transparent',
      border: `${FILTER_SHEET.PILL_BORDER_WIDTH}px solid ${
        isDark ? customColors.darkBorder : customColors.filterPillBorder
      }`,
      borderRadius: FILTER_SHEET.PILL_RADIUS,
      padding: `${FILTER_SHEET.PILL_PADDING_Y}px ${FILTER_SHEET.PILL_PADDING_X}px`,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    filterSheetPillSelected: {
      color: customColors.mobileNavActive,
      borderColor: customColors.mobileNavActive,
    },
    filterSheetButtons: {
      'display': 'flex',
      'gap': FILTER_SHEET.BUTTONS_GAP,
      'marginTop': FILTER_SHEET.BUTTONS_MT,
      '& > *': {
        flex: `1 1 0`,
        minWidth: 0,
      },
    },
    tableCard: {
      'width': '100%',
      'maxWidth': '100%',
      'minWidth': 0,
      'marginTop': SPACING.PAGE,
      'backgroundColor': cardBg,
      ...cardBorderStyle,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'padding': '20px',
      'position': 'relative',
      'overflow': 'visible',
      'boxSizing': 'border-box',
      '& table': { minWidth: 0 },
      '& table td': { verticalAlign: 'middle', minWidth: 0, lineHeight: '28px' },
      '& table th': { verticalAlign: 'middle', lineHeight: '28px' },
    },
  }
})

export const useStyles = (params: { isDark: boolean; themeColors: ThemeConfig }) => {
  const { classes } = useStylesBase(params)
  const { isDark, themeColors } = params
  const badgeStyles = useMemo(
    () => ({
      statusBadgeEnabled: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
      statusBadgeDisabled: {
        backgroundColor: themeColors.background,
        textColor: themeColors.fontColor,
        borderColor: themeColors.borderColor,
      },
      httpMethodBadgeGetPost: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
      httpMethodBadgePutPatch: {
        backgroundColor: customColors.orange,
        textColor: customColors.white,
        borderColor: 'transparent',
      },
      httpMethodBadgeDelete: {
        backgroundColor: customColors.statusInactive,
        textColor: customColors.white,
        borderColor: 'transparent',
      },
      httpMethodBadgeDefault: {
        backgroundColor: isDark ? customColors.darkBackground : customColors.buttonLightBg,
        textColor: isDark ? customColors.white : customColors.primaryDark,
        borderColor: isDark ? customColors.darkBorder : customColors.lightBorder,
      },
    }),
    [isDark, themeColors],
  )
  return { classes, badgeStyles }
}
