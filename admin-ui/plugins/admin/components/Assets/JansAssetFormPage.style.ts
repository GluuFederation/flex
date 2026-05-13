import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import {
  SPACING,
  BORDER_RADIUS,
  CEDARLING_CONFIG_SPACING,
  MAPPING_SPACING,
  ICON_SIZE,
  OPACITY,
} from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'

interface AssetFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

const WIDTH_FULL = '100%'
const BOX_SIZING_BORDER = 'border-box'
const DISPLAY_FLEX = 'flex'
const FLEX_DIRECTION_COLUMN = 'column'
const MARGIN_ZERO_IMPORTANT = '0 !important'
const OUTLINE_NONE = 'none'

export const useStyles = makeStyles<AssetFormPageStylesParams>()((
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

  const GAP_SM = 12
  const nativeInputLineHeightPx =
    CEDARLING_CONFIG_SPACING.INPUT_HEIGHT - 2 * CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL - 2

  return {
    formCard: {
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: WIDTH_FULL,
      position: 'relative',
      overflow: 'visible',
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      boxSizing: BOX_SIZING_BORDER,
    },
    content: {
      padding: SPACING.CONTENT_PADDING,
      width: WIDTH_FULL,
      boxSizing: BOX_SIZING_BORDER,
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      gap: 32,
      [theme.breakpoints.down('sm')]: {
        padding: SPACING.PAGE,
      },
    },
    formSection: {
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      width: WIDTH_FULL,
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
      fontSize: ICON_SIZE.MD,
    },
    alertText: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.relaxed,
      color: infoText,
      margin: 0,
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
        flexDirection: 'column' as const,
        flexWrap: 'nowrap' as const,
      },
      '& .form-group > label': {
        flex: '0 0 auto',
        width: WIDTH_FULL,
        maxWidth: WIDTH_FULL,
        paddingLeft: MARGIN_ZERO_IMPORTANT,
        paddingRight: MARGIN_ZERO_IMPORTANT,
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '2px !important',
      },
      '& .form-group [class*="col"]': {
        flex: '0 0 100%',
        width: WIDTH_FULL,
        maxWidth: WIDTH_FULL,
        paddingLeft: MARGIN_ZERO_IMPORTANT,
        paddingRight: MARGIN_ZERO_IMPORTANT,
        minWidth: 0,
        boxSizing: BOX_SIZING_BORDER,
      },
      '& .input-group': {
        margin: MARGIN_ZERO_IMPORTANT,
      },
    },
    fieldItemFullWidth: {
      'width': WIDTH_FULL,
      'gridColumn': '1 / -1',
      'paddingTop': 0,
      'paddingBottom': SPACING.CARD_CONTENT_GAP,
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
      '& input:not(.MuiInputBase-input), & select, & .custom-select': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor}`,
        borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
        color: `${themeColors.fontColor} !important`,
        caretColor: themeColors.fontColor,
        boxSizing: BOX_SIZING_BORDER,
        height: CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
        minHeight: CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
        paddingTop: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingBottom: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingLeft: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
        paddingRight: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
        lineHeight: `${nativeInputLineHeightPx}px`,
      },
      '& select, & .custom-select': {
        paddingRight: 44,
      },
      '& input:not(.MuiInputBase-input):focus, & input:not(.MuiInputBase-input):active, & select:focus, & select:active, & .custom-select:focus, & .custom-select:active':
        {
          backgroundColor: `${formInputBg} !important`,
          color: `${themeColors.fontColor} !important`,
          border: `1px solid ${inputBorderColor} !important`,
          outline: OUTLINE_NONE,
          boxShadow: OUTLINE_NONE,
        },
      '& input:not(.MuiInputBase-input):disabled, & select:disabled, & .custom-select:disabled': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: OPACITY.DISABLED,
        cursor: 'not-allowed',
      },
      '& input:not(.MuiInputBase-input)::placeholder': {
        color: themeColors.textMuted,
      },
      '& input.form-control, & input[type="text"], & textarea.form-control': {
        backgroundColor: `${formInputBg} !important`,
        color: `${themeColors.fontColor} !important`,
        WebkitTextFillColor: `${themeColors.fontColor} !important`,
        caretColor: themeColors.fontColor,
      },
      '& input.form-control:focus, & input.form-control:active, & input[type="text"]:focus, & input[type="text"]:active, & textarea.form-control:focus, & textarea.form-control:active':
        {
          color: `${themeColors.fontColor} !important`,
          WebkitTextFillColor: `${themeColors.fontColor} !important`,
          caretColor: themeColors.fontColor,
        },
      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active':
        {
          WebkitBoxShadow: `0 0 0 100px ${formInputBg} inset !important`,
          WebkitTextFillColor: `${themeColors.fontColor} !important`,
          color: `${themeColors.fontColor} !important`,
          backgroundColor: `${formInputBg} !important`,
          transition: 'background-color 5000s ease-in-out 0s',
        },
    },
    uploadError: {
      display: 'block',
      color: themeColors.errorColor,
      fontSize: 12,
      marginTop: 4,
    },
    uploadBox: {
      'marginTop': 0,
      'width': WIDTH_FULL,
      '& .dropzone': {
        backgroundColor: `${isDark ? formInputBg : infoBg} !important`,
        border: `1px solid ${isDark ? 'transparent' : infoBorder}`,
        borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
        padding: '24px',
        minHeight: CEDARLING_CONFIG_SPACING.DROPZONE_MIN_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        textAlign: 'center',
      },
      '& .dropzone:has(strong)': {
        justifyContent: 'flex-start',
        textAlign: 'left',
      },
      '& .dropzone p': {
        color: `${isDark ? customColors.dropzoneText : infoText} !important`,
        margin: 0,
      },
      '& .dropzone strong': {
        color: `${isDark ? customColors.dropzoneText : infoText} !important`,
      },
      '& .dropzone .btn:not(.gluu-upload-remove), & .dropzone button:not(.gluu-upload-remove)': {
        color: `${isDark ? customColors.dropzoneText : infoText} !important`,
        border: 'none !important',
        backgroundColor: 'transparent !important',
      },
      '& .dropzone .btn:not(.gluu-upload-remove):hover, & .dropzone .btn:not(.gluu-upload-remove):focus, & .dropzone button:not(.gluu-upload-remove):hover, & .dropzone button:not(.gluu-upload-remove):focus':
        {
          color: `${isDark ? customColors.dropzoneText : infoText} !important`,
          border: 'none !important',
          backgroundColor: 'transparent !important',
        },
    },
    uploadField: {
      '& > label': {
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '2px !important',
      },
      '& > label h5, & > label h5 span, & > label span': {
        margin: '0 !important',
        lineHeight: `${lineHeights.normal} !important`,
      },
    },
    serviceSelectField: {
      '& [data-field-error]': {
        marginTop: 6,
      },
    },
    toggleRow: {
      'display': DISPLAY_FLEX,
      'alignItems': 'center',
      'gap': 16,
      'marginTop': 8,
      '& .react-toggle': {
        verticalAlign: 'middle',
      },
    },
    extraPaddingTop: {
      paddingTop: 8,
    },
  }
})
