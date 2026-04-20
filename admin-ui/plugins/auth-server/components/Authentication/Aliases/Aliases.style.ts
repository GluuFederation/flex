import { makeStyles } from 'tss-react/mui'
import { fontFamily, lineHeights, fontWeights, fontSizes } from '@/styles/fonts'
import {
  createFormInputStyles,
  createFormInputFocusStyles,
  createFormInputAutofillStyles,
  createFormInputPlaceholderStyles,
} from '@/styles/formStyles'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { ICON_SIZE, SPACING } from '@/constants'
import type { ThemeConfig } from '@/context/theme/config'

const TABLE_LINE_HEIGHT = lineHeights.relaxed

export const useStyles = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const inputBg = themeColors.inputBackground
  const cardBorderStyle = getCardBorderStyle({ isDark })

  const inputColors = {
    inputBg,
    inputBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
  }

  return {
    page: {
      'fontFamily': fontFamily,
      'width': '100%',
      'maxWidth': '100%',
      'minWidth': 0,
      'boxSizing': 'border-box' as const,
      'paddingTop': SPACING.CARD_CONTENT_GAP,
      '& table td': {
        verticalAlign: 'middle',
        minWidth: 0,
        lineHeight: TABLE_LINE_HEIGHT,
        wordBreak: 'break-all',
        overflowWrap: 'anywhere',
      },
      '& table th': {
        verticalAlign: 'middle',
        lineHeight: TABLE_LINE_HEIGHT,
      },
    },
    editIcon: { fontSize: ICON_SIZE.SM },
    deleteIcon: { fontSize: ICON_SIZE.SM },
    modalContainer: {
      ...cardBorderStyle,
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: cardBg,
      width: 'min(720px, 90vw)',
      maxWidth: '720px',
    },
    fieldsColumn: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 20,
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
    },
    fieldLabel: {
      fontFamily,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes.base,
      lineHeight: 'normal',
      color: themeColors.fontColor,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    fieldInput: {
      'width': '100%',
      'boxSizing': 'border-box' as const,
      fontFamily,
      'fontSize': fontSizes.base,
      'outline': 'none',
      ...createFormInputStyles(inputColors),
      '&::placeholder': createFormInputPlaceholderStyles(themeColors.textMuted),
      '&:focus, &:focus-visible': createFormInputFocusStyles(inputColors),
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
        createFormInputAutofillStyles(inputColors),
    },
    inputWrapper: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
    },
    formFooter: {
      paddingTop: 16,
      paddingBottom: 8,
    },
  }
})
