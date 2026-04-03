import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS, OPACITY } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getDynamicListStyles } from '@/styles/dynamicListStyles'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'

type FidoConfigStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const WIDTH_FULL = '100%'
const BOX_SIZING_BORDER = 'border-box'
const DISPLAY_FLEX = 'flex'
const FLEX_DIRECTION_COLUMN = 'column'
const MARGIN_ZERO = 0
const OUTLINE_NONE = 'none'
const LABEL_MARGIN_BOTTOM = 6
const SELECT_ARROW_SPACE = 44
const SELECT_NUDGE = -2
const ERROR_SPACE = 20
const INPUT_HEIGHT = 52
const INPUT_PADDING_VERTICAL = 14
const INPUT_PADDING_HORIZONTAL = 21
const PROPS_HEADER_MB = 16

export const useStyles = makeStyles<FidoConfigStylesParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background

  const headersBoxBg = formInputBg
  const headersInputBg = cardBg
  const headersBorderColor =
    themeColors.settings?.inputBorder ??
    themeColors.borderColor ??
    (isDark ? customColors.darkBorder : customColors.borderInput)

  const dl = getDynamicListStyles({
    boxBg: headersBoxBg,
    inputBg: headersInputBg,
    borderColor: headersBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
    errorColor: themeColors.errorColor,
  })

  return {
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
    fieldItemFullWidth: {
      'width': WIDTH_FULL,
      'gridColumn': '1 / -1',
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
      '& input:focus, & input:active, & select:focus, & select:active, & .custom-select:focus, & .custom-select:active':
        {
          backgroundColor: `${formInputBg} !important`,
          color: `${themeColors.fontColor} !important`,
          border: `1px solid ${inputBorderColor} !important`,
          borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
          outline: `${OUTLINE_NONE} !important`,
          boxShadow: `${OUTLINE_NONE} !important`,
        },
      '& input:focus-visible, & select:focus-visible': {
        borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
        outline: `${OUTLINE_NONE} !important`,
        boxShadow: `${OUTLINE_NONE} !important`,
      },
      '& input:disabled, & select:disabled, & .custom-select:disabled': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: OPACITY.FULL,
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
    propsBox: dl.listBox,
    propsBoxWithMargin: { marginTop: PROPS_HEADER_MB },
    propsBoxEmpty: dl.listBoxEmpty,
    propsHeader: dl.listHeader,
    propsHeaderEmpty: dl.listHeaderEmpty,
    propsTitle: dl.listTitle,
    propsBody: dl.listBody,
    propsRow: dl.listRow,
    propsInput: dl.listInput,
    propsError: dl.listError,
    propsActionBtn: dl.listActionBtn,
    hintsSection: {
      marginTop: PROPS_HEADER_MB,
    },
  }
})
