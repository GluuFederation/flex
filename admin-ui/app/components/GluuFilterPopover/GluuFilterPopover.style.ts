import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontSizes, fontWeights, letterSpacing } from '@/styles/fonts'
import {
  BORDER_RADIUS,
  INPUT,
  MOBILE_MEDIA_QUERY,
  OPACITY,
  FILTER_POPOVER,
  FILTER_SHEET,
  SPACING,
} from '@/constants'
import type { StyleParams } from './types'

export const useStyles = makeStyles<StyleParams>()((_, { themeColors, isDark, width, columns }) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputBg = themeColors.inputBackground
  const inputBorder = themeColors.fontColor
  const inputColor = themeColors.fontColor
  const popoverBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const sheetInputBorder = isDark ? 'transparent' : popoverBorderColor

  return {
    container: {
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      backgroundColor: cardBg,
      border: `1px solid ${popoverBorderColor}`,
      width: width ?? FILTER_POPOVER.WIDTH,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: SPACING.CARD_CONTENT_GAP * 2,
      boxSizing: 'border-box',
      fontFamily,
      marginTop: SPACING.CARD_CONTENT_GAP / 2,
      overflow: 'visible',
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 12,
      marginBottom: SPACING.CARD_CONTENT_GAP * 2,
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 4,
      minWidth: 0,
    },
    fieldGroupFull: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 4,
      minWidth: 0,
      gridColumn: '1 / -1',
    },
    fieldLabel: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semiBold,
      color: themeColors.fontColor,
      fontFamily,
    },
    selectWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    select: {
      'width': '100%',
      'height': INPUT.HEIGHT,
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
      'appearance': 'none' as const,
      'WebkitAppearance': 'none' as const,
      'MozAppearance': 'none' as const,
      'boxSizing': 'border-box' as const,
      '&:focus': {
        borderColor: inputBorder,
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        'borderColor': sheetInputBorder,
        '&:focus': {
          borderColor: sheetInputBorder,
        },
      },
    },
    selectChevron: {
      position: 'absolute',
      right: INPUT.CHEVRON_RIGHT,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      display: 'flex',
      color: inputColor,
    },
    textInput: {
      'width': '100%',
      'height': INPUT.HEIGHT,
      'padding': `0 ${INPUT.PADDING_HORIZONTAL}px`,
      'border': `1px solid ${inputBorder}`,
      'borderRadius': BORDER_RADIUS.SMALL,
      'backgroundColor': inputBg,
      'color': inputColor,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.medium,
      fontFamily,
      'outline': 'none',
      'boxSizing': 'border-box' as const,
      '&::placeholder': {
        color: inputColor,
        opacity: OPACITY.PLACEHOLDER,
      },
      '&:focus': {
        borderColor: inputBorder,
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        'borderColor': sheetInputBorder,
        '&:focus': {
          borderColor: sheetInputBorder,
        },
      },
    },
    buttonRow: {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 12,
    },
    sheetContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: FILTER_SHEET.FIELD_GROUP_GAP,
      padding: `${FILTER_SHEET.TITLE_TO_GROUP}px ${FILTER_SHEET.PADDING_X}px ${FILTER_SHEET.BODY_PADDING_BOTTOM}px`,
      fontFamily,
      boxSizing: 'border-box' as const,
    },
    sheetFieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: FILTER_SHEET.FIELD_LABEL_MB,
      minWidth: 0,
    },
    sheetFieldLabel: {
      fontSize: fontSizes.description,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.normal,
      color: themeColors.fontColor,
      fontFamily,
    },
    sheetButtonRow: {
      'display': 'flex',
      'gap': FILTER_SHEET.BUTTONS_GAP,
      'marginTop': FILTER_SHEET.BUTTONS_MT - FILTER_SHEET.FIELD_GROUP_GAP,
      '& > *': {
        flex: '1 1 0',
        minWidth: 0,
      },
    },
  }
})
