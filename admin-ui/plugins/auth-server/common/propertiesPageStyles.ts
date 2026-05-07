import type { Theme } from '@mui/material/styles'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, CEDARLING_CONFIG_SPACING, OPACITY, SPACING } from '@/constants'
import customColors, { hexToRgb } from '@/customColors'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { createFormGroupOverrides, createFormLabelStyles } from '@/styles/formStyles'

export type PropertiesStyleProps = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const createPropertiesPageStyles = (
  theme: Theme,
  { isDark, themeColors }: PropertiesStyleProps,
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const fontColor = themeColors.fontColor
  const accordionBorderColor = isDark
    ? `rgba(${hexToRgb(customColors.darkBorderGradientBase)}, 0.35)`
    : inputBorderColor
  const accordionHeaderBg = isDark ? customColors.darkInputBg : themeColors.inputBackground

  return {
    searchCard: {
      width: '100%',
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: `${SPACING.SECTION_GAP}px ${SPACING.CARD_PADDING}px`,
      marginBottom: SPACING.CARD_GAP,
      position: 'relative' as const,
      zIndex: 0,
      overflow: 'visible',
      boxSizing: 'border-box' as const,
    },
    searchCardContent: {
      position: 'relative' as const,
      zIndex: 2,
      isolation: 'isolate' as const,
      pointerEvents: 'auto' as const,
    },
    pageCard: {
      'backgroundColor': `${cardBg} !important`,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      ...cardBorderStyle,
      'overflow': 'visible',
      'marginBottom': SPACING.PAGE,
      '& .card-body': {
        backgroundColor: `${cardBg} !important`,
        borderRadius: BORDER_RADIUS.DEFAULT,
      },
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: '100%',
    },
    formContent: {
      'flex': 1,
      'padding': `${SPACING.SECTION_GAP}px ${SPACING.CARD_PADDING}px 100px`,
      ...createFormGroupOverrides(),
      ...createFormLabelStyles(fontColor),
      '& .form-group > label': {
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '2px !important',
      },
      '& .form-group > label h5, & .form-group > label h5 span': {
        margin: '0 !important',
      },
      '& .form-control, & input, & select, & .custom-select': {
        'backgroundColor': `${formInputBg} !important`,
        'border': `1px solid ${inputBorderColor} !important`,
        'color': `${fontColor} !important`,
        'minHeight': CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
        'height': 'auto',
        'paddingTop': CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        'paddingBottom': CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        'paddingLeft': CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
        'paddingRight': CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
        'borderRadius': BORDER_RADIUS.SMALL,
        '&:focus': {
          outline: 'none !important',
          boxShadow: 'none !important',
          borderColor: `${inputBorderColor} !important`,
        },
        '&::placeholder': {
          color: `${fontColor} !important`,
          opacity: OPACITY.PLACEHOLDER,
        },
        '&:disabled': {
          opacity: OPACITY.DISABLED,
          cursor: 'not-allowed',
        },
      },
      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
        WebkitBoxShadow: `0 0 0 100px ${formInputBg} inset !important`,
        WebkitTextFillColor: `${fontColor} !important`,
        backgroundColor: `${formInputBg} !important`,
        transition: 'background-color 5000s ease-in-out 0s',
      },
      '& .card.b-primary': {
        border: `1px solid ${accordionBorderColor} !important`,
        borderRadius: BORDER_RADIUS.ACCORDION,
        overflow: 'visible',
        marginBottom: SPACING.CARD_CONTENT_GAP,
        backgroundColor: `${cardBg} !important`,
        boxShadow: 'none !important',
      },
      '& .card.b-primary > .card-header': {
        backgroundColor: `${accordionHeaderBg} !important`,
        borderBottom: `1px solid ${accordionBorderColor} !important`,
        borderTop: 'none !important',
        borderRadius: `${BORDER_RADIUS.ACCORDION}px ${BORDER_RADIUS.ACCORDION}px 0 0`,
        padding: '12px 20px',
        fontSize: '15px',
        fontWeight: 600,
        color: `${fontColor} !important`,
      },
      '& .card.b-primary:has(> .collapse:not(.show)) > .card-header': {
        borderBottom: 'none !important',
        borderRadius: BORDER_RADIUS.ACCORDION,
      },
      '& .card.b-primary > .card-header span': {
        color: `${fontColor} !important`,
      },
      '& .card.b-primary > .card-header button:not(.remove-btn), & .card.b-primary > .card-header .btn:not(.remove-btn)':
        {
          color: `${fontColor} !important`,
        },
      '& .card.b-primary .card-body': {
        backgroundColor: `${cardBg} !important`,
        color: `${fontColor} !important`,
        padding: `${SPACING.SECTION_GAP}px ${SPACING.CARD_PADDING}px !important`,
        borderRadius: `0 0 ${BORDER_RADIUS.ACCORDION}px ${BORDER_RADIUS.ACCORDION}px`,
      },
      '& .card.b-primary .card.b-primary': {
        border: `1px solid ${accordionBorderColor} !important`,
        borderRadius: BORDER_RADIUS.ACCORDION,
        overflow: 'visible',
        marginTop: '0 !important',
        marginBottom: `${SPACING.SECTION_GAP}px !important`,
        backgroundColor: `${cardBg} !important`,
        boxShadow: 'none !important',
      },
      '& .card.b-primary .form-control, & .card.b-primary input, & .card.b-primary select, & .card.b-primary textarea':
        {
          backgroundColor: `${formInputBg} !important`,
          border: 'none !important',
          color: `${fontColor} !important`,
        },
      '& .card.b-primary label, & .card.b-primary .col-form-label': {
        color: `${fontColor} !important`,
      },
      '& .card.b-primary .row, & .card.b-primary .mb-3, & .card.b-primary .form-row': {
        color: `${fontColor} !important`,
      },
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.SECTION_GAP,
      width: '100%',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
    fieldItem: {
      'minWidth': 0,
      'width': '100%',
      '& .row.mb-3, & .mb-3': {
        marginBottom: '0 !important',
      },
      '& .row': {
        marginLeft: '0 !important',
        marginRight: '0 !important',
      },
      '& [class*="col-sm"]': {
        flex: '0 0 100% !important',
        maxWidth: '100% !important',
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
      },
      '& [class*="col-sm-2"]': {
        display: 'none !important',
      },
      '& .input-group, & .custom-select, & select': {
        width: '100% !important',
      },
    },
    fieldItemFullWidth: {
      gridColumn: '1 / -1',
      minWidth: 0,
      width: '100%',
    },
    stickyFooter: {
      'position': 'sticky' as const,
      'bottom': 0,
      'zIndex': 10,
      'backgroundColor': cardBg,
      'paddingTop': SPACING.FORM_FOOTER_GAP,
      'paddingLeft': SPACING.CARD_PADDING,
      'paddingRight': SPACING.CARD_PADDING,
      'paddingBottom': SPACING.CARD_CONTENT_GAP,
      '& hr, & .MuiDivider-root': {
        display: 'none !important',
      },
      '& .MuiBox-root': {
        marginTop: '0 !important',
        marginBottom: '0 !important',
      },
    },
    errorAlert: {
      margin: `${SPACING.CARD_CONTENT_GAP}px ${SPACING.CARD_PADDING}px`,
    },
  }
}
