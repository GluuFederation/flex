import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { SPACING, BORDER_RADIUS, MAPPING_SPACING } from '@/constants'
import { fontSizes, fontWeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import {
  createFormGroupOverrides,
  createFormLabelStyles,
  createFormInputStyles,
  createFormInputFocusStyles,
  createFormInputPlaceholderStyles,
  createInfoAlertStyles,
} from '@/styles/formStyles'

type StyleProps = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StyleProps>()((_theme, { isDark, themeColors }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const fontColor = themeColors.fontColor
  const textMuted = themeColors.textMuted
  const inputColors = { inputBg: formInputBg, inputBorderColor, fontColor, textMuted }

  return {
    pageCard: {
      backgroundColor: cardBg,
      borderRadius: BORDER_RADIUS.DEFAULT,
      ...cardBorderStyle,
      padding: SPACING.CARD_PADDING,
    },
    sectionTitle: {
      color: fontColor,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      marginBottom: SPACING.CARD_CONTENT_GAP * 2,
    },
    accordionWrapper: {
      marginBottom: SPACING.CARD_CONTENT_GAP,
    },
    accordionHeader: {
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'space-between',
      'padding': `14px ${SPACING.SECTION_GAP}px`,
      'backgroundColor': formInputBg,
      'border': `1px solid ${inputBorderColor}`,
      'borderRadius': MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      'cursor': 'pointer',
      'transition': 'background-color 0.15s ease-in-out',
      'color': fontColor,
      'fontWeight': fontWeights.semiBold,
      'fontSize': fontSizes.base,
      'userSelect': 'none' as const,
      '&:hover': {
        opacity: 0.9,
      },
    },
    accordionHeaderOpen: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderBottom: 'none',
    },
    accordionIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: BORDER_RADIUS.CIRCLE,
      backgroundColor: themeColors.infoAlert.background,
      color: fontColor,
      flexShrink: 0,
    },
    accordionBody: {
      'padding': `${SPACING.SECTION_GAP}px ${SPACING.SECTION_GAP}px ${SPACING.CARD_CONTENT_GAP}px`,
      'border': `1px solid ${inputBorderColor}`,
      'borderTop': 'none',
      'borderBottomLeftRadius': MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      'borderBottomRightRadius': MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      'backgroundColor': cardBg,
      ...createFormGroupOverrides(),
      ...createFormLabelStyles(fontColor),
      '& input, & textarea': {
        ...createFormInputStyles(inputColors),
        cursor: 'not-allowed',
      },
      '& textarea': {
        height: 'auto',
        overflow: 'auto',
      },
      '& input:focus, & input:focus-visible, & input:active, & textarea:focus, & textarea:focus-visible':
        {
          ...createFormInputFocusStyles(inputColors),
        },
      '& input::placeholder, & textarea::placeholder': {
        ...createFormInputPlaceholderStyles(textMuted),
      },
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: SPACING.CARD_CONTENT_GAP * 2,
    },
    fieldItem: {
      minWidth: 0,
    },
    fieldItemFullWidth: {
      gridColumn: '1 / -1',
      minWidth: 0,
    },
    formLabels: createFormLabelStyles(fontColor),
    ...createInfoAlertStyles(themeColors.infoAlert),
  }
})
