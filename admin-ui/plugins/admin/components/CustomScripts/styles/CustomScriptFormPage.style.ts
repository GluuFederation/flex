import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS, CEDARLING_CONFIG_SPACING, MAPPING_SPACING } from '@/constants'
import { fontFamily, fontWeights, fontSizes } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { ThemeConfig } from '@/context/theme/config'
import customColors, { getLoadingOverlayRgba } from '@/customColors'
import { OPACITY } from '@/constants/ui'

interface CustomScriptFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

const WIDTH_FULL = '100%'
const BOX_SIZING_BORDER = 'border-box'
const DISPLAY_FLEX = 'flex'
const FLEX_DIRECTION_COLUMN = 'column'
const MARGIN_ZERO_IMPORTANT = '0 !important'
const OUTLINE_NONE = 'none'
const FIELD_VERTICAL_PADDING = 4
const ERROR_SPACE = 20

export const useStyles = makeStyles<CustomScriptFormPageStylesParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const headersBoxBg = themeColors.settings?.customParamsBox ?? cardBg
  const headersInputBg = themeColors.settings?.customParamsInput ?? formInputBg
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
      minHeight: 400,
      position: 'relative' as const,
      overflow: 'visible' as const,
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      boxSizing: BOX_SIZING_BORDER,
    },
    content: {
      paddingTop: SPACING.PAGE,
      paddingLeft: 52,
      paddingRight: 52,
      paddingBottom: SPACING.CONTENT_PADDING,
      width: WIDTH_FULL,
      boxSizing: BOX_SIZING_BORDER,
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      gap: 32,
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
    descriptionEnabledRow: {
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
      gridColumn: '1 / -1',
    },
    fieldItem: {
      'width': WIDTH_FULL,
      'minWidth': 0,
      'boxSizing': BOX_SIZING_BORDER,
      '& .form-group': {
        display: DISPLAY_FLEX,
        flexDirection: FLEX_DIRECTION_COLUMN,
        margin: MARGIN_ZERO_IMPORTANT,
        padding: MARGIN_ZERO_IMPORTANT,
      },
      '& .form-group.row': {
        marginLeft: MARGIN_ZERO_IMPORTANT,
        marginRight: MARGIN_ZERO_IMPORTANT,
      },
      '& .form-group > label': {
        flex: '0 0 auto',
        width: WIDTH_FULL,
        maxWidth: WIDTH_FULL,
        paddingLeft: MARGIN_ZERO_IMPORTANT,
        paddingRight: MARGIN_ZERO_IMPORTANT,
        marginBottom: '6px !important',
      },
      '& .form-group [class*="col"]': {
        flex: '0 0 100%',
        width: WIDTH_FULL,
        maxWidth: WIDTH_FULL,
        paddingLeft: MARGIN_ZERO_IMPORTANT,
        paddingRight: MARGIN_ZERO_IMPORTANT,
        position: 'relative',
        paddingBottom: ERROR_SPACE,
      },
      '& [data-field-error]': {
        position: 'absolute',
        fontSize: '12px !important',
      },
      '& .input-group': {
        margin: MARGIN_ZERO_IMPORTANT,
      },
    },
    levelError: {
      color: themeColors.errorColor,
      marginTop: 4,
    },
    errorButton: {
      backgroundColor: themeColors.errorColor,
      color:
        themeColors.settings?.errorButtonText ??
        themeColors.formFooter?.back?.textColor ??
        customColors.white,
    },
    fieldItemFullWidth: {
      'width': WIDTH_FULL,
      'gridColumn': '1 / -1',
      'paddingTop': FIELD_VERTICAL_PADDING,
      'paddingBottom': FIELD_VERTICAL_PADDING,
      'boxSizing': BOX_SIZING_BORDER,
      '& .form-group': {
        marginBottom: 0,
      },
      '& .form-group.row': {
        marginLeft: MARGIN_ZERO_IMPORTANT,
        marginRight: MARGIN_ZERO_IMPORTANT,
      },
      '& .form-group [class*="col"]': {
        paddingLeft: MARGIN_ZERO_IMPORTANT,
        paddingRight: MARGIN_ZERO_IMPORTANT,
      },
    },
    formLabels: {
      '& label, & label h5, & label .MuiSvgIcon-root': {
        color: `${themeColors.fontColor} !important`,
        fontFamily: `${fontFamily} !important`,
        fontSize: `${fontSizes.base} !important`,
        fontStyle: 'normal !important',
        fontWeight: `${fontWeights.semiBold} !important`,
        lineHeight: 'normal !important',
        margin: '0 !important',
      },
    },
    formWithInputs: {
      '& input, & select, & .custom-select': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor}`,
        borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
        color: `${themeColors.fontColor} !important`,
        minHeight: CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
        height: 'auto',
        paddingTop: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingBottom: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingLeft: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
        paddingRight: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
      },
      '& select, & .custom-select': {
        paddingRight: 44,
        marginTop: -2,
        marginBottom: -2,
      },
      '& input:focus, & input:active, & select:focus, & select:active, & .custom-select:focus, & .custom-select:active':
        {
          backgroundColor: `${formInputBg} !important`,
          color: `${themeColors.fontColor} !important`,
          border: `1px solid ${inputBorderColor} !important`,
          outline: OUTLINE_NONE,
          boxShadow: OUTLINE_NONE,
        },
      '& input:disabled, & select:disabled, & .custom-select:disabled': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: 1,
        cursor: 'not-allowed',
      },
      '& input::placeholder': {
        color: themeColors.textMuted,
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
    propertiesBox: {
      'backgroundColor': headersBoxBg,
      'borderRadius': MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      'border': `1px solid ${headersBorderColor}`,
      'padding': `15px ${CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL}px 33px`,
      'width': WIDTH_FULL,
      'boxSizing': BOX_SIZING_BORDER,
      '& input': {
        backgroundColor: `${headersInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        fontFamily: fontFamily,
        fontSize: fontSizes.base,
      },
      '& input::placeholder': {
        color: `${themeColors.textMuted} !important`,
        opacity: '1 !important',
      },
    },
    editorTheme: {
      '& .ace_editor': {
        backgroundColor: `${formInputBg} !important`,
        color: `${themeColors.fontColor} !important`,
        borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
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
        background: `${getLoadingOverlayRgba(isDark ? customColors.white : customColors.black, isDark ? OPACITY.HOVER_DARK : OPACITY.HOVER_LIGHT)} !important`,
      },
      '& .ace_editor .ace_gutter-active-line': {
        background: `${getLoadingOverlayRgba(isDark ? customColors.white : customColors.black, isDark ? OPACITY.HOVER_DARK : OPACITY.HOVER_LIGHT)} !important`,
      },
    },
  }
})
