import { CEDARLING_CONFIG_SPACING, MAPPING_SPACING } from '@/constants'
import { fontFamily, fontSizes, fontWeights, lineHeights, letterSpacing } from '@/styles/fonts'

type InfoAlertColors = {
  background: string
  icon: string
  text: string
}

type InputStyleColors = {
  inputBg: string
  inputBorderColor: string
  fontColor: string
  textMuted: string
}

const LABEL_MARGIN_BOTTOM = 6

export const createFormGroupOverrides = (opts?: { columnPaddingBottom?: number }) => ({
  '& .form-group': {
    display: 'flex',
    flexDirection: 'column' as const,
    margin: '0 !important',
    padding: 0,
    minWidth: 0,
  },
  '& .form-group.row': {
    marginLeft: '0 !important',
    marginRight: '0 !important',
    flexDirection: 'column' as const,
    flexWrap: 'nowrap' as const,
    minWidth: 0,
  },
  '& .form-group > label': {
    flex: '0 0 auto',
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    paddingTop: '4px !important',
    paddingBottom: '4px !important',
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: LABEL_MARGIN_BOTTOM,
  },
  '& .form-group [class*="col"]': {
    flex: '0 0 100%',
    width: '100%',
    maxWidth: '100%',
    paddingLeft: 0,
    paddingRight: 0,
    minWidth: 0,
    boxSizing: 'border-box' as const,
    ...(opts?.columnPaddingBottom != null
      ? { position: 'relative' as const, paddingBottom: opts.columnPaddingBottom }
      : {}),
  },
  '& [data-field-error]': {
    position: 'absolute' as const,
    fontSize: `${fontSizes.sm} !important`,
  },
})

/**
 * Styles labels (label, h5, span, MUI icon) inside a form section.
 */
export const createFormLabelStyles = (fontColor: string) => ({
  '& label, & label h5, & label h5 span, & label span, & label .MuiSvgIcon-root, & h5': {
    color: `${fontColor} !important`,
    fontFamily: `${fontFamily} !important`,
    fontSize: `${fontSizes.base} !important`,
    fontStyle: 'normal !important',
    fontWeight: `${fontWeights.semiBold} !important`,
    lineHeight: `${lineHeights.normal} !important`,
    letterSpacing: `${letterSpacing.normal} !important`,
    margin: '0 !important',
  },
})

export const createFormInputStyles = (colors: InputStyleColors) => {
  const { inputBg, inputBorderColor, fontColor } = colors
  return {
    backgroundColor: inputBg,
    border: `1px solid ${inputBorderColor} !important`,
    borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
    color: `${fontColor} !important`,
    caretColor: fontColor,
    minHeight: CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
    height: 'auto',
    paddingTop: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
    paddingBottom: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
    paddingLeft: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
    paddingRight: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
  }
}

export const createFormInputFocusStyles = (colors: InputStyleColors) => ({
  backgroundColor: colors.inputBg,
  color: `${colors.fontColor} !important`,
  border: `1px solid ${colors.inputBorderColor} !important`,
  outline: 'none !important',
  boxShadow: 'none !important',
})

export const createFormInputPlaceholderStyles = (textMuted: string) => ({
  color: `${textMuted} !important`,
  opacity: 1,
})

export const createFormInputAutofillStyles = (colors: InputStyleColors) => ({
  WebkitBoxShadow: `0 0 0 100px ${colors.inputBg} inset !important`,
  WebkitTextFillColor: `${colors.fontColor} !important`,
  caretColor: colors.fontColor,
  transition: 'background-color 5000s ease-in-out 0s',
})

export const createInfoAlertStyles = (infoAlert: InfoAlertColors) => ({
  infoAlert: {
    backgroundColor: infoAlert.background,
    border: 'none',
    borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
    padding: `${MAPPING_SPACING.INFO_ALERT_PADDING_VERTICAL}px ${MAPPING_SPACING.INFO_ALERT_PADDING_HORIZONTAL}px`,
    display: 'flex',
    alignItems: 'center',
    gap: MAPPING_SPACING.INFO_ALERT_GAP,
  },
  infoIcon: {
    width: MAPPING_SPACING.INFO_ICON_SIZE,
    height: MAPPING_SPACING.INFO_ICON_SIZE,
    color: infoAlert.icon,
    flexShrink: 0,
  },
  infoText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    color: infoAlert.text,
  },
})
