import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import {
  SPACING,
  BORDER_RADIUS,
  CEDARLING_CONFIG_SPACING,
  MAPPING_SPACING,
  getHoverOpacity,
} from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { getDynamicListStyles } from '@/styles/dynamicListStyles'
import type { ThemeConfig } from '@/context/theme/config'
import customColors, { getLoadingOverlayRgba } from '@/customColors'

interface WebhookFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

const WIDTH_FULL = '100%'
const BOX_SIZING_BORDER = 'border-box'
const DISPLAY_FLEX = 'flex'
const FLEX_DIRECTION_COLUMN = 'column'
const MARGIN_ZERO_IMPORTANT = '0 !important'
const OUTLINE_NONE = 'none'
const GAP_SM = 12
const CONTENT_PADDING_H = 52
const ALERT_ICON_SIZE = 20
const EDITOR_FALLBACK_MIN_HEIGHT = 120
const ERROR_SPACE = 20

export const useStyles = makeStyles<WebhookFormPageStylesParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const settings = themeColors.settings
  const infoBg = themeColors.infoAlert?.background ?? customColors.cedarInfoBgLight
  const infoBorder = themeColors.infoAlert?.border ?? customColors.cedarInfoBorderLight
  const infoText = themeColors.infoAlert?.text ?? customColors.cedarInfoTextLight
  const cardBg = settings?.cardBackground ?? themeColors.card.background
  const formInputBg = settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = settings?.inputBorder ?? themeColors.borderColor
  const headersBoxBg = formInputBg
  const headersInputBg = cardBg
  const headersBorderColor =
    settings?.inputBorder ?? (isDark ? customColors.darkBorder : customColors.borderInput)

  const dl = getDynamicListStyles({
    boxBg: headersBoxBg,
    inputBg: headersInputBg,
    borderColor: headersBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
    errorColor: themeColors.errorColor,
  })

  return {
    formCard: {
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: WIDTH_FULL,
      minHeight: 400,
      position: 'relative',
      overflow: 'visible',
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      boxSizing: BOX_SIZING_BORDER,
    },
    content: {
      paddingTop: `${SPACING.PAGE}px`,
      paddingLeft: `${CONTENT_PADDING_H}px`,
      paddingRight: `${CONTENT_PADDING_H}px`,
      paddingBottom: `${SPACING.CONTENT_PADDING}px`,
      width: WIDTH_FULL,
      boxSizing: BOX_SIZING_BORDER,
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      gap: 32,
      [theme.breakpoints.down('sm')]: {
        paddingLeft: `${SPACING.PAGE}px`,
        paddingRight: `${SPACING.PAGE}px`,
      },
    },
    alertBox: {
      backgroundColor: infoBg,
      border: `1px solid ${infoBorder}`,
      borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      padding: '12px 16px',
      display: DISPLAY_FLEX,
      alignItems: 'center',
      gap: GAP_SM,
      color: infoText,
      width: WIDTH_FULL,
      boxSizing: BOX_SIZING_BORDER,
      marginBottom: MAPPING_SPACING.CARD_MARGIN_BOTTOM,
    },
    alertIcon: {
      flexShrink: 0,
      color: infoText,
      fontSize: ALERT_ICON_SIZE,
    },
    alertText: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.relaxed,
      color: infoText,
      margin: 0,
    },
    formSection: {
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      gap: SPACING.SECTION_GAP,
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
    headersBox: {
      ...dl.listBox,
      'marginTop': SPACING.SECTION_GAP,
      '&& input, && input:focus, && input:active, && input:disabled': {
        backgroundColor: `${headersInputBg} !important`,
        border: `1px solid ${headersBorderColor} !important`,
        borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
      },
      '& > div:first-of-type label, & > div:first-of-type label h5, & > div:first-of-type label span':
        {
          fontSize: '15px !important',
          fontWeight: '700 !important',
        },
    },
    headersBoxEmpty: dl.listBoxEmpty,
    headersHeader: dl.listHeader,
    headersHeaderEmpty: dl.listHeaderEmpty,
    headersBody: dl.listBody,
    headersRow: dl.listRow,
    headersInput: { ...dl.listInput, maxWidth: '50%' },
    headersActionBtn: dl.listActionBtn,
    headersError: dl.listError,
    extraPaddingTop: {
      paddingTop: 8,
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
    urlFieldItem: {
      /* Override form input padding/overflow so URL text doesn't merge with shortcode icon (higher specificity than formWithInputs) */
      '&& input': {
        paddingRight: 52,
        overflowX: 'auto',
        overflowY: 'hidden',
        minWidth: 0,
      },
    },
    fieldItemFullWidth: {
      'width': WIDTH_FULL,
      'gridColumn': '1 / -1',
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
        letterSpacing: `${letterSpacing.normal} !important`,
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
    editorFallback: {
      minHeight: EDITOR_FALLBACK_MIN_HEIGHT,
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
        background: `${getLoadingOverlayRgba(isDark ? customColors.white : customColors.black, getHoverOpacity(isDark))} !important`,
      },
      '& .ace_editor .ace_gutter-active-line': {
        background: `${getLoadingOverlayRgba(isDark ? customColors.white : customColors.black, getHoverOpacity(isDark))} !important`,
      },
    },
    editorShortcode: {
      'position': 'absolute',
      'top': 0,
      'right': 0,
      'zIndex': 1,
      'margin': 0,
      '& button': {
        padding: '2px 24px !important',
        minHeight: 'auto !important',
      },
    },
  }
})
