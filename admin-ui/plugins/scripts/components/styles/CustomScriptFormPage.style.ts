import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS, getHoverOpacity, MAPPING_SPACING, OPACITY } from '@/constants'
import { fontFamily, fontWeights, fontSizes, letterSpacing, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { ThemeConfig } from '@/context/theme/config'
import customColors, { getLoadingOverlayRgba } from '@/customColors'

interface CustomScriptFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

const WIDTH_FULL = '100%'
const BOX_SIZING_BORDER = 'border-box'
const DISPLAY_FLEX = 'flex'
const FLEX_DIRECTION_COLUMN = 'column'
const MARGIN_ZERO = 0
const OUTLINE_NONE = 'none'
const FIELD_VERTICAL_PADDING = 4
const ERROR_SPACE = 20
const LABEL_MARGIN_BOTTOM = 6
const FORM_CARD_MIN_HEIGHT = 400
const CONTENT_HORIZONTAL_PADDING = 52
const CONTENT_GAP = 0
const SELECT_ARROW_SPACE = 44
const SELECT_NUDGE = -2
const PROPS_HEADER_MB = 16
const PROPS_HEADER_GAP = 12
const PROPS_BOX_TOP_PADDING = 12
const PROPS_INPUT_MIN_HEIGHT = 44
const PROPS_INPUT_PADDING = '10px 12px'
const PROPS_INPUT_MIN_WIDTH = 120
const PROPS_INPUT_FLEX = '1 1 200px'
const PROPS_BTN_SIZE = 156
const PROPS_BTN_GAP = 8
const INPUT_HEIGHT = 52
const INPUT_PADDING_VERTICAL = 14
const INPUT_PADDING_HORIZONTAL = 21
const BTN_PADDING = '6px 16px'
const LOADING_MIN_HEIGHT = 300
const ERROR_ICON_SIZE = MAPPING_SPACING.INFO_ICON_SIZE

export const useStyles = makeStyles<CustomScriptFormPageStylesParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const hoverOpacity = getHoverOpacity(isDark)
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor

  // Match Settings page custom parameters: box uses form input background,
  // inner inputs use card background so they visually pop inside the box.
  const headersBoxBg = formInputBg
  const headersInputBg = cardBg
  const headersBorderColor =
    themeColors.settings?.inputBorder ??
    themeColors.borderColor ??
    (isDark ? customColors.darkBorder : customColors.borderInput)

  return {
    formCard: {
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: WIDTH_FULL,
      minHeight: FORM_CARD_MIN_HEIGHT,
      position: 'relative' as const,
      overflow: 'visible' as const,
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      boxSizing: BOX_SIZING_BORDER,
    },
    content: {
      paddingTop: SPACING.PAGE,
      paddingLeft: CONTENT_HORIZONTAL_PADDING,
      paddingRight: CONTENT_HORIZONTAL_PADDING,
      paddingBottom: SPACING.CONTENT_PADDING,
      width: WIDTH_FULL,
      boxSizing: BOX_SIZING_BORDER,
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      gap: CONTENT_GAP,
    },
    formSection: {
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      gap: 0,
      width: WIDTH_FULL,
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      width: WIDTH_FULL,
      alignItems: 'start',
      minWidth: 0,
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
    levelEnabledRow: {
      'gridColumn': '1 / -1',
      'display': DISPLAY_FLEX,
      'gap': SPACING.SECTION_GAP,
      'alignItems': 'flex-start',
      'minWidth': 0,
      '& > div': {
        flex: '1 1 0',
        minWidth: 0,
      },
      [theme.breakpoints.down('md')]: {
        flexDirection: FLEX_DIRECTION_COLUMN,
      },
    },
    inumFullWidth: {
      'gridColumn': '1 / -1',
      '& input, & input:disabled': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
      },
    },
    loadingPlaceholder: {
      padding: SPACING.PAGE,
      textAlign: 'center' as const,
      color: themeColors.fontColor,
      minHeight: LOADING_MIN_HEIGHT,
      display: DISPLAY_FLEX,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorBox: {
      'backgroundColor': `${getLoadingOverlayRgba(customColors.accentRed, isDark ? 0.15 : 0.06)} !important`,
      'borderRadius': BORDER_RADIUS.SMALL,
      'padding': `${INPUT_PADDING_VERTICAL}px ${SPACING.CARD_PADDING}px`,
      'border': `1px solid ${getLoadingOverlayRgba(customColors.accentRed, isDark ? 0.4 : 0.25)}`,
      'minHeight': INPUT_HEIGHT,
      'display': 'flex',
      'alignItems': 'center',
      '& .MuiAlert-message': {
        flex: 1,
        color: `${customColors.white} !important`,
      },
      '& .MuiAlert-icon': {
        color: `${themeColors.errorColor} !important`,
        alignItems: 'center',
        fontSize: ERROR_ICON_SIZE,
      },
    },
    fieldItem: {
      'width': WIDTH_FULL,
      'minWidth': 0,
      'boxSizing': BOX_SIZING_BORDER,
      '& .form-group': {
        display: DISPLAY_FLEX,
        flexDirection: FLEX_DIRECTION_COLUMN,
        margin: MARGIN_ZERO,
        padding: MARGIN_ZERO,
      },
      '& .form-group.row': {
        marginLeft: MARGIN_ZERO,
        marginRight: MARGIN_ZERO,
      },
      '& .form-group > label': {
        flex: '0 0 auto',
        width: WIDTH_FULL,
        maxWidth: WIDTH_FULL,
        paddingLeft: MARGIN_ZERO,
        paddingRight: MARGIN_ZERO,
        marginBottom: LABEL_MARGIN_BOTTOM,
      },
      '& .form-group [class*="col"]': {
        flex: '0 0 100%',
        width: WIDTH_FULL,
        maxWidth: WIDTH_FULL,
        paddingLeft: MARGIN_ZERO,
        paddingRight: MARGIN_ZERO,
        position: 'relative',
        paddingBottom: ERROR_SPACE,
      },
      '& [data-field-error]': {
        position: 'absolute',
        fontSize: `${fontSizes.sm} !important`,
      },
      '& .input-group': {
        margin: MARGIN_ZERO,
      },
    },
    levelError: {
      color: themeColors.errorColor,
      marginTop: 4,
    },
    errorButton: {
      'backgroundColor': themeColors.errorColor,
      'color': customColors.white,
      'border': 'none',
      'borderRadius': BORDER_RADIUS.SMALL,
      'fontFamily': fontFamily,
      'fontWeight': fontWeights.semiBold,
      'fontSize': fontSizes.sm,
      'padding': BTN_PADDING,
      'cursor': 'pointer',
      '&:hover': {
        opacity: 0.85,
        backgroundColor: themeColors.errorColor,
        color: customColors.white,
      },
      '&:focus, &:active': {
        opacity: 1,
        backgroundColor: themeColors.errorColor,
        color: customColors.white,
        outline: OUTLINE_NONE,
        boxShadow: OUTLINE_NONE,
      },
    },
    errorAlert: {
      'width': '100%',
      'maxWidth': 'none',
      'boxSizing': 'border-box',
      'marginBottom': SPACING.PAGE,
      'minHeight': INPUT_HEIGHT,
      'padding': `${INPUT_PADDING_VERTICAL}px ${SPACING.CARD_PADDING}px`,
      'backgroundColor': `${getLoadingOverlayRgba(customColors.accentRed, isDark ? 0.15 : 0.06)} !important`,
      'color': `${themeColors.formFooter.back.textColor} !important`,
      'border': `1px solid ${getLoadingOverlayRgba(customColors.accentRed, isDark ? 0.4 : 0.25)}`,
      'borderRadius': `${BORDER_RADIUS.SMALL}px !important`,
      'display': 'flex',
      'alignItems': 'center',
      '&:hover': {
        opacity: 1 - hoverOpacity,
      },
      '& .MuiAlert-message': {
        flex: 1,
        color: `${customColors.white} !important`,
      },
      '& .MuiAlert-icon': {
        color: `${themeColors.errorColor} !important`,
        alignItems: 'center',
        fontSize: ERROR_ICON_SIZE,
      },
      '& .MuiAlert-action': {
        padding: 0,
        marginRight: 0,
      },
    },
    errorAlertText: {
      color: `${themeColors.fontColor} !important`,
    },
    errorAlertIcon: {
      fontSize: ERROR_ICON_SIZE,
    },
    fieldItemFullWidth: {
      'width': WIDTH_FULL,
      'gridColumn': '1 / -1',
      'paddingTop': FIELD_VERTICAL_PADDING,
      'paddingBottom': FIELD_VERTICAL_PADDING,
      'boxSizing': BOX_SIZING_BORDER,
      '& .form-group': {
        display: DISPLAY_FLEX,
        flexDirection: FLEX_DIRECTION_COLUMN,
        margin: MARGIN_ZERO,
        padding: MARGIN_ZERO,
      },
      '& .form-group.row': {
        marginLeft: MARGIN_ZERO,
        marginRight: MARGIN_ZERO,
      },
      '& .form-group > label': {
        flex: '0 0 auto',
        width: WIDTH_FULL,
        maxWidth: WIDTH_FULL,
        paddingLeft: MARGIN_ZERO,
        paddingRight: MARGIN_ZERO,
        marginBottom: LABEL_MARGIN_BOTTOM,
      },
      '& .form-group [class*="col"]': {
        flex: '0 0 100%',
        width: WIDTH_FULL,
        maxWidth: WIDTH_FULL,
        paddingLeft: MARGIN_ZERO,
        paddingRight: MARGIN_ZERO,
      },
      '& .input-group': {
        margin: MARGIN_ZERO,
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
        margin: '0 !important',
      },
    },
    formWithInputs: {
      '& input, & select, & .custom-select': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor}`,
        borderRadius: BORDER_RADIUS.SMALL,
        color: `${themeColors.fontColor} !important`,
        minHeight: INPUT_HEIGHT,
        height: 'auto',
        paddingTop: INPUT_PADDING_VERTICAL,
        paddingBottom: INPUT_PADDING_VERTICAL,
        paddingLeft: INPUT_PADDING_HORIZONTAL,
        paddingRight: INPUT_PADDING_HORIZONTAL,
      },
      '& select, & .custom-select': {
        paddingRight: SELECT_ARROW_SPACE,
        marginTop: SELECT_NUDGE,
        marginBottom: SELECT_NUDGE,
      },
      '& input:focus, & input:active, & select:focus, & select:active, & .custom-select:focus, & .custom-select:active, & .form-control:focus, & .input-group:focus-within':
        {
          borderColor: `${inputBorderColor} !important`,
          borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
          outline: `${OUTLINE_NONE} !important`,
          boxShadow: `${OUTLINE_NONE} !important`,
        },
      '& input:disabled, & select:disabled, & .custom-select:disabled': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: 1,
        cursor: 'not-allowed',
      },
      '& input::placeholder': {
        color: `${themeColors.textMuted} !important`,
        opacity: `${OPACITY.PLACEHOLDER} !important`,
      },
      '& input.form-control, & input[type="text"], & textarea.form-control': {
        color: `${themeColors.fontColor} !important`,
      },
      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active':
        {
          WebkitBoxShadow: `0 0 0 100px ${formInputBg} inset !important`,
          WebkitTextFillColor: `${themeColors.fontColor} !important`,
          backgroundColor: `${formInputBg} !important`,
          transition: 'background-color 5000s ease-in-out 0s',
        },
    },
    propsBox: {
      'backgroundColor': headersBoxBg,
      'borderRadius': BORDER_RADIUS.SMALL,
      'border': `1px solid ${headersBorderColor}`,
      'padding': `${PROPS_BOX_TOP_PADDING}px ${SPACING.CARD_PADDING}px ${SPACING.CARD_PADDING}px`,
      'width': WIDTH_FULL,
      'boxSizing': BOX_SIZING_BORDER,
      '& input, & input:focus, & input:active, & input:disabled': {
        backgroundColor: `${headersInputBg} !important`,
        border: `1px solid ${headersBorderColor} !important`,
      },
    },
    propsBoxEmpty: {
      paddingBottom: PROPS_BOX_TOP_PADDING,
    },
    propsHeader: {
      display: DISPLAY_FLEX,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: PROPS_HEADER_MB,
      gap: PROPS_HEADER_GAP,
    },
    propsHeaderEmpty: {
      marginBottom: 0,
    },
    propsTitle: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes.description,
      fontStyle: 'normal',
      lineHeight: 1.4,
      letterSpacing: letterSpacing.normal,
      color: themeColors.fontColor,
      margin: 0,
      padding: 0,
    },
    propsBody: {
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      gap: SPACING.CARD_CONTENT_GAP,
    },
    propsRow: {
      display: DISPLAY_FLEX,
      gap: SPACING.CARD_CONTENT_GAP,
      alignItems: 'center',
      flexWrap: 'wrap' as const,
    },
    propsInput: {
      'flex': PROPS_INPUT_FLEX,
      'minWidth': PROPS_INPUT_MIN_WIDTH,
      'minHeight': PROPS_INPUT_MIN_HEIGHT,
      'boxSizing': BOX_SIZING_BORDER,
      'backgroundColor': `${headersInputBg} !important`,
      'border': `1px solid ${headersBorderColor} !important`,
      'borderRadius': BORDER_RADIUS.SMALL,
      'padding': PROPS_INPUT_PADDING,
      'color': themeColors.fontColor,
      'fontFamily': fontFamily,
      'fontSize': fontSizes.base,
      '&::placeholder': {
        color: `${themeColors.textMuted} !important`,
        opacity: `${OPACITY.PLACEHOLDER} !important`,
      },
      '&:focus, &:active': {
        backgroundColor: `${headersInputBg} !important`,
        color: themeColors.fontColor,
        border: `1px solid ${headersBorderColor} !important`,
        outline: `${OUTLINE_NONE} !important`,
        boxShadow: `${OUTLINE_NONE} !important`,
      },
    },
    propsActionBtn: {
      '&&': {
        minWidth: PROPS_BTN_SIZE,
        width: PROPS_BTN_SIZE,
        minHeight: PROPS_INPUT_MIN_HEIGHT,
        height: PROPS_INPUT_MIN_HEIGHT,
        gap: PROPS_BTN_GAP,
        flexShrink: 0,
      },
    },
    editorTheme: {
      '& .ace_editor': {
        backgroundColor: `${formInputBg} !important`,
        color: `${themeColors.fontColor} !important`,
        borderRadius: BORDER_RADIUS.SMALL,
        border: `1px solid ${inputBorderColor}`,
      },
      '& .ace_editor .ace_print-margin': {
        display: 'none',
      },
      '& .ace_editor .ace_gutter': {
        backgroundColor: `${formInputBg} !important`,
        color: `${themeColors.textMuted} !important`,
      },
      '& .ace_editor .ace_content': {
        backgroundColor: `${formInputBg} !important`,
        color: `${themeColors.fontColor} !important`,
      },
      '& .ace_editor .ace_cursor': {
        color: `${themeColors.fontColor} !important`,
      },
      '& .ace_editor .ace_active-line': {
        background: `${getLoadingOverlayRgba(isDark ? customColors.white : customColors.black, getHoverOpacity(isDark))} !important`,
      },
      '& .ace_editor .ace_gutter-active-line': {
        background: `${getLoadingOverlayRgba(isDark ? customColors.white : customColors.black, getHoverOpacity(isDark))} !important`,
      },
    },
  }
})
