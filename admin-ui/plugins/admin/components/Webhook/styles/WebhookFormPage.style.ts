import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS, CEDARLING_CONFIG_SPACING, MAPPING_SPACING } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { themeConfig } from '@/context/theme/config'
import customColors from '@/customColors'

type ThemeColors = (typeof themeConfig)[keyof typeof themeConfig]

interface WebhookFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeColors
}

const WIDTH_FULL = '100%'
const BOX_SIZING_BORDER = 'border-box'
const DISPLAY_FLEX = 'flex'
const FLEX_DIRECTION_COLUMN = 'column'
const MARGIN_ZERO_IMPORTANT = '0 !important'
const OUTLINE_NONE = 'none'

const GAP_SM = 12
const FIELD_VERTICAL_PADDING = 4
const HEADERS_BOX_PADDING_TOP = 15
const CONTENT_PADDING_H = 52

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
  const headersBoxBg = settings?.customParamsInput ?? formInputBg
  const headersInputBg = settings?.customParamsBox ?? cardBg
  const headersBorderColor =
    settings?.inputBorder ?? (isDark ? customColors.darkBorder : customColors.borderInput)

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
      marginBottom: 16,
    },
    alertIcon: {
      flexShrink: 0,
      color: infoText,
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
      gap: 0,
      width: WIDTH_FULL,
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      width: WIDTH_FULL,
      alignItems: 'center',
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
      'backgroundColor': headersBoxBg,
      'borderRadius': MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      'border': `1px solid ${headersBorderColor}`,
      'padding': `${HEADERS_BOX_PADDING_TOP}px ${CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL}px 33px`,
      'width': WIDTH_FULL,
      'boxSizing': BOX_SIZING_BORDER,
      '& > div:first-child label, & > div:first-child label h5, & > div:first-child label span': {
        fontSize: '15px !important',
        fontWeight: '700 !important',
      },
      '&& input': {
        backgroundColor: `${headersInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        fontFamily: fontFamily,
        fontSize: fontSizes.base,
      },
      '&& input::placeholder': {
        color: `${themeColors.textMuted} !important`,
        opacity: '1 !important',
      },
      '&& input:focus, && input:active': {
        backgroundColor: `${headersInputBg} !important`,
        color: `${themeColors.fontColor} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        outline: OUTLINE_NONE,
        boxShadow: OUTLINE_NONE,
      },
    },
    headersBoxEmpty: {
      paddingBottom: HEADERS_BOX_PADDING_TOP,
    },
    headersHeader: {
      display: DISPLAY_FLEX,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 21,
      gap: GAP_SM,
    },
    headersHeaderEmpty: {
      marginBottom: 0,
    },
    headersBody: {
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      gap: GAP_SM,
    },
    headersRow: {
      display: DISPLAY_FLEX,
      gap: GAP_SM,
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    headersInput: {
      flex: '1 1 200px',
      minWidth: 120,
      minHeight: CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
      boxSizing: BOX_SIZING_BORDER,
      borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      padding: `${CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL}px ${CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL}px`,
    },
    headersActionBtn: {
      minWidth: 156,
      width: 156,
      minHeight: '44px !important',
      height: '44px !important',
      gap: 8,
      flexShrink: 0,
    },
    headersError: {
      color: themeColors.errorColor,
      fontSize: fontSizes.sm,
      marginTop: 4,
    },
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
      },
      '& .input-group': {
        margin: MARGIN_ZERO_IMPORTANT,
      },
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
    },
  }
})
