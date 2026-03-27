import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import { BORDER_RADIUS, INPUT, OPACITY, FILTER_POPOVER, SPACING } from '@/constants'
import type { StyleParams } from './types'

export const useStyles = makeStyles<StyleParams>()((_, { themeColors, width, columns }) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputBg = themeColors.inputBackground
  const inputBorder = themeColors.fontColor
  const inputColor = themeColors.fontColor
  const popoverBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor

  return {
    container: {
      position: 'absolute',
      top: '100%',
      right: 0,
      zIndex: 10,
      backgroundColor: cardBg,
      border: `1px solid ${popoverBorderColor}`,
      width: width ?? FILTER_POPOVER.WIDTH,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: SPACING.CARD_CONTENT_GAP * 2,
      boxSizing: 'border-box',
      fontFamily,
      marginTop: SPACING.CARD_CONTENT_GAP,
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
    },
    buttonRow: {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 12,
    },
  }
})
