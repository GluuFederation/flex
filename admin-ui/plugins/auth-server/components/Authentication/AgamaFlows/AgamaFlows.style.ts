import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, ICON_SIZE, MAPPING_SPACING, SPACING } from '@/constants'
import customColors from '@/customColors'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily, fontSizes, fontWeights, lineHeights } from '@/styles/fonts'
import {
  createFormInputStyles,
  createFormInputFocusStyles,
  createFormInputPlaceholderStyles,
  createFormInputAutofillStyles,
} from '@/styles/formStyles'

const CARD_INNER_PADDING = 20
const TABLE_LINE_HEIGHT = lineHeights.relaxed

export const useStyles = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor

  const inputColors = {
    inputBg: themeColors.inputBackground,
    inputBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
  }

  return {
    page: { fontFamily, paddingTop: SPACING.CARD_CONTENT_GAP },
    searchCard: {
      width: '100%',
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: `${SPACING.PAGE}px ${CARD_INNER_PADDING}px`,
      marginBottom: `${CARD_INNER_PADDING}px`,
      position: 'relative',
      zIndex: 0,
      overflow: 'visible',
      boxSizing: 'border-box' as const,
    },
    searchCardContent: {
      position: 'relative',
      zIndex: 2,
      isolation: 'isolate' as const,
      pointerEvents: 'auto' as const,
    },
    tableCard: {
      'width': '100%',
      'maxWidth': '100%',
      'minWidth': 0,
      'marginTop': SPACING.PAGE,
      'backgroundColor': cardBg,
      ...cardBorderStyle,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'padding': `${CARD_INNER_PADDING}px`,
      'position': 'relative',
      'overflow': 'visible',
      'boxSizing': 'border-box' as const,
      '& table td': { verticalAlign: 'top', minWidth: 0, lineHeight: TABLE_LINE_HEIGHT },
      '& table th': { verticalAlign: 'middle', lineHeight: TABLE_LINE_HEIGHT },
    },
    addIcon: { fontSize: ICON_SIZE.MD },
    infoIcon: { fontSize: ICON_SIZE.SM },
    settingsIcon: { fontSize: ICON_SIZE.SM },
    deleteIcon: { fontSize: ICON_SIZE.SM },
    addModalContainer: {
      ...getCardBorderStyle({ isDark }),
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: cardBg,
    },
    modalTitle: {
      borderBottom: `1px solid ${inputBorderColor}`,
    },
    modalBody: {
      padding: '8px 0 0',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 12,
    },
    modalFooter: {
      display: 'flex',
      gap: 12,
      paddingTop: 16,
      paddingBottom: 8,
    },
    // Dropzone
    dropzone: {
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': '100%',
      'minHeight': 90,
      'padding': '16px 20px',
      'boxSizing': 'border-box' as const,
      'background': themeColors.infoAlert.background,
      'border': `1px solid ${themeColors.infoAlert.border}`,
      'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      'cursor': 'pointer',
      '&:hover': {
        background: themeColors.infoAlert.background,
        border: `1px solid ${themeColors.infoAlert.border}`,
        borderRadius: `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      },
    },
    dropzoneActive: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: 90,
      padding: '16px 20px',
      boxSizing: 'border-box' as const,
      background: themeColors.infoAlert.background,
      border: `1.5px dashed ${themeColors.infoAlert.border}`,
      borderRadius: `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      cursor: 'pointer',
      opacity: 0.85,
    },
    dropzoneText: {
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.tight,
      color: themeColors.infoAlert.text,
      margin: 0,
      textAlign: 'center' as const,
    },
    dropzoneSelectedText: {
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semiBold,
      color: themeColors.fontColor,
      margin: 0,
      textAlign: 'center' as const,
      wordBreak: 'break-all' as const,
    },
    shaStatusSuccess: {
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: themeColors.badges?.statusActive ?? customColors.statusActive,
      margin: 0,
      minHeight: 18,
    },
    shaStatusError: {
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: themeColors.errorColor,
      margin: 0,
      minHeight: 18,
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
      lineHeight: lineHeights.normal,
      color: themeColors.fontColor,
      margin: 0,
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
  }
})
