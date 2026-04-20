import { makeStyles } from 'tss-react/mui'
import { BORDER_RADIUS, CEDARLING_CONFIG_SPACING, INPUT, OPACITY, SPACING } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/config'

type DefaultAcrStylesParams = {
  themeColors: ThemeConfig
}

const WIDTH_FULL = '100%'
const FIELD_WIDTH = '50%'
const BOX_SIZING_BORDER = 'border-box'
const DISPLAY_FLEX = 'flex'
const FLEX_DIRECTION_COLUMN = 'column'
const MOBILE_BREAKPOINT = 768

export const useStyles = makeStyles<DefaultAcrStylesParams>()((_theme, { themeColors }) => {
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground

  return {
    defaultAcrSection: {
      width: WIDTH_FULL,
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN as 'column',
      gap: SPACING.SECTION_GAP,
    },
    fieldItem: {
      'width': FIELD_WIDTH,
      'minWidth': 0,
      'boxSizing': BOX_SIZING_BORDER as 'border-box',
      [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
        width: WIDTH_FULL,
      },
      '& .form-group': {
        display: DISPLAY_FLEX,
        flexDirection: FLEX_DIRECTION_COLUMN as 'column',
        margin: 0,
        padding: 0,
      },
      '& .form-group.row': {
        marginLeft: 0,
        marginRight: 0,
      },
      '& .form-group > label': {
        flex: '0 0 auto',
        width: WIDTH_FULL,
        maxWidth: WIDTH_FULL,
        paddingLeft: 0,
        paddingRight: 0,
        marginBottom: CEDARLING_CONFIG_SPACING.LABEL_MB,
      },
      '& .form-group [class*="col"]': {
        flex: '0 0 100%',
        width: WIDTH_FULL,
        maxWidth: WIDTH_FULL,
        paddingLeft: 0,
        paddingRight: 0,
        position: 'relative',
      },
      '& [role="combobox"][tabindex="-1"]': {
        backgroundColor: `${formInputBg} !important`,
        opacity: OPACITY.FULL,
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
    formWithInputs: {
      '& select, & .custom-select': {
        backgroundColor: `${themeColors.inputBackground} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
        color: `${themeColors.fontColor} !important`,
        WebkitTextFillColor: `${themeColors.fontColor} !important`,
        caretColor: themeColors.fontColor,
        fontFamily: `${fontFamily} !important`,
        fontSize: `${fontSizes.base} !important`,
        lineHeight: `${lineHeights.normal} !important`,
        minHeight: INPUT.HEIGHT,
        height: 'auto',
        paddingTop: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingBottom: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingLeft: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
        paddingRight: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL * 2,
      },
      '& select:focus, & select:active, & .custom-select:focus, & .custom-select:active': {
        backgroundColor: `${themeColors.inputBackground} !important`,
        color: `${themeColors.fontColor} !important`,
        WebkitTextFillColor: `${themeColors.fontColor} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        outline: 'none',
        boxShadow: 'none',
      },
      '& select:disabled, & .custom-select:disabled': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: OPACITY.FULL,
        cursor: 'not-allowed',
      },
    },
  }
})
