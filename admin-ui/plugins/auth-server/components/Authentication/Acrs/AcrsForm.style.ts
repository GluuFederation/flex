import type { CSSProperties } from 'react'
import { makeStyles } from 'tss-react/mui'
import { SPACING, BORDER_RADIUS, CEDARLING_CONFIG_SPACING, INPUT, OPACITY } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { getDynamicListStyles } from '@/styles/dynamicListStyles'
import customColors from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'

export const errorTextStyle: CSSProperties = {
  color: customColors.accentRed,
  marginTop: -12,
}

type AcrsFormStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const SELECT_ARROW_SPACE = 44
const SELECT_NUDGE = -2
const CONTENT_HORIZONTAL_PADDING = 52
const CONTENT_HORIZONTAL_PADDING_MOBILE = 20
const FORM_CARD_MIN_HEIGHT = 400
const MOBILE_BREAKPOINT = 768

const PROPS_HEADER_MB = 16

export const useStyles = makeStyles<AcrsFormStylesParams>()((_, { isDark, themeColors }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground

  const dl = getDynamicListStyles({
    boxBg: formInputBg,
    inputBg: cardBg,
    borderColor: inputBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
    errorColor: themeColors.errorColor,
  })

  return {
    formCard: {
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: '100%',
      minHeight: FORM_CARD_MIN_HEIGHT,
      position: 'relative' as const,
      overflow: 'visible' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      boxSizing: 'border-box' as const,
    },
    content: {
      paddingTop: SPACING.PAGE,
      paddingLeft: CONTENT_HORIZONTAL_PADDING,
      paddingRight: CONTENT_HORIZONTAL_PADDING,
      paddingBottom: SPACING.CONTENT_PADDING,
      width: '100%',
      boxSizing: 'border-box' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
        paddingLeft: CONTENT_HORIZONTAL_PADDING_MOBILE,
        paddingRight: CONTENT_HORIZONTAL_PADDING_MOBILE,
      },
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
      [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
        gridTemplateColumns: '1fr',
      },
    },
    fieldItem: {
      'width': '100%',
      'minWidth': 0,
      'boxSizing': 'border-box' as const,
      '& .form-group': {
        display: 'flex',
        flexDirection: 'column' as const,
        margin: 0,
        padding: 0,
      },
      '& .form-group.row': {
        marginLeft: 0,
        marginRight: 0,
      },
      '& .form-group > label': {
        flex: '0 0 auto',
        width: '100%',
        maxWidth: '100%',
        paddingLeft: 0,
        paddingRight: 0,
        marginBottom: 6,
      },
      '& .form-group [class*="col"]': {
        flex: '0 0 100%',
        width: '100%',
        maxWidth: '100%',
        paddingLeft: 0,
        paddingRight: 0,
        position: 'relative',
        paddingBottom: 20,
      },
      '& [data-field-error]': {
        position: 'absolute',
        fontSize: `${fontSizes.sm} !important`,
      },
      '& .input-group': {
        margin: 0,
      },
      '& [role="combobox"][tabindex="-1"]': {
        backgroundColor: `${formInputBg} !important`,
        opacity: OPACITY.FULL,
        cursor: 'not-allowed',
      },
    },
    fieldItemFullWidth: {
      gridColumn: '1 / -1',
    },
    toggleRow: {
      'width': '100%',
      'minWidth': 0,
      'boxSizing': 'border-box' as const,
      '& .form-group': {
        display: 'flex',
        flexDirection: 'column' as const,
        margin: 0,
        padding: 0,
        width: '100%',
      },
      '& .form-group.row': {
        marginLeft: 0,
        marginRight: 0,
      },
      '& .form-group > label': {
        flex: '0 0 auto',
        width: '100%',
        maxWidth: '100%',
        paddingLeft: 0,
        paddingRight: 0,
        marginBottom: 6,
      },
      '& .form-group [class*="col"]': {
        flex: '0 0 100%',
        width: '100%',
        maxWidth: '100%',
        paddingLeft: 0,
        paddingRight: 0,
      },
      '& .react-toggle--disabled': {
        opacity: `${OPACITY.FULL} !important`,
        cursor: 'not-allowed',
      },
    },
    formLabels: {
      '& label, & label h5, & label h5 span, & label .MuiSvgIcon-root': {
        color: `${themeColors.fontColor} !important`,
        fontFamily: `${fontFamily} !important`,
        fontSize: `${fontSizes.base} !important`,
        fontStyle: 'normal !important',
        fontWeight: `${fontWeights.semiBold} !important`,
        lineHeight: `${lineHeights.normal} !important`,
      },
    },
    propsBox: { ...dl.listBox, marginTop: PROPS_HEADER_MB },
    propsBoxEmpty: dl.listBoxEmpty,
    propsHeader: dl.listHeader,
    propsHeaderEmpty: dl.listHeaderEmpty,
    propsTitle: dl.listTitle,
    propsBody: dl.listBody,
    propsRow: dl.listRow,
    propsInput: dl.listInput,
    propsError: dl.listError,
    propsActionBtn: dl.listActionBtn,
    formWithInputs: {
      '& input:not([type="checkbox"]), & select, & .custom-select, & textarea': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
        color: `${themeColors.fontColor} !important`,
        WebkitTextFillColor: `${themeColors.fontColor} !important`,
        caretColor: themeColors.fontColor,
        minHeight: INPUT.HEIGHT,
        height: 'auto',
        paddingTop: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingBottom: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingLeft: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
        paddingRight: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
      },
      '& select, & .custom-select': {
        paddingRight: SELECT_ARROW_SPACE,
        marginTop: SELECT_NUDGE,
        marginBottom: SELECT_NUDGE,
      },
      '& input:not([type="checkbox"]):focus, & input:not([type="checkbox"]):active, & select:focus, & select:active, & .custom-select:focus, & .custom-select:active, & textarea:focus, & textarea:active':
        {
          backgroundColor: `${formInputBg} !important`,
          color: `${themeColors.fontColor} !important`,
          WebkitTextFillColor: `${themeColors.fontColor} !important`,
          border: `1px solid ${inputBorderColor} !important`,
          outline: 'none',
          boxShadow: 'none',
        },
      '& input:not([type="checkbox"]):disabled, & select:disabled, & .custom-select:disabled, & textarea:disabled':
        {
          backgroundColor: `${formInputBg} !important`,
          border: `1px solid ${inputBorderColor} !important`,
          color: `${themeColors.fontColor} !important`,
          opacity: OPACITY.FULL,
          cursor: 'not-allowed',
        },
      '& input:not([type="checkbox"]).is-valid, & input:not([type="checkbox"]).is-invalid, & select.is-valid, & select.is-invalid, & textarea.is-valid, & textarea.is-invalid':
        {
          border: `1px solid ${inputBorderColor} !important`,
          backgroundImage: 'none !important',
          boxShadow: 'none !important',
        },
      '& input.form-control, & input[type="text"], & input[type="number"], & textarea.form-control':
        {
          backgroundColor: `${formInputBg} !important`,
          color: `${themeColors.fontColor} !important`,
          WebkitTextFillColor: `${themeColors.fontColor} !important`,
          caretColor: `${themeColors.fontColor} !important`,
        },
      '& input.form-control:focus, & input.form-control:active, & input.form-control:disabled': {
        color: `${themeColors.fontColor} !important`,
        WebkitTextFillColor: `${themeColors.fontColor} !important`,
        caretColor: `${themeColors.fontColor} !important`,
      },
      '& input:not([type="checkbox"])::selection, & textarea::selection': {
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
        color: `${themeColors.fontColor} !important`,
      },
      '& input:not([type="checkbox"])::placeholder, & textarea::placeholder': {
        color: `${themeColors.textMuted} !important`,
        opacity: `${OPACITY.PLACEHOLDER} !important`,
      },
      '& input:not([type="checkbox"]):-webkit-autofill, & input:not([type="checkbox"]):-webkit-autofill:hover, & input:not([type="checkbox"]):-webkit-autofill:focus, & input:not([type="checkbox"]):-webkit-autofill:active':
        {
          WebkitBoxShadow: `0 0 0 100px ${formInputBg} inset !important`,
          WebkitTextFillColor: `${themeColors.fontColor} !important`,
          backgroundColor: `${formInputBg} !important`,
          transition: 'background-color 5000s ease-in-out 0s',
        },
    },
  }
})
