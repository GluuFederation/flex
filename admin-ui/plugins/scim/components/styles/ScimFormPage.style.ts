import { makeStyles } from 'tss-react/mui'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS, OPACITY } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/config'

interface ScimFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

const LABEL_MARGIN_BOTTOM = 6
const FORM_CARD_MIN_HEIGHT = 400
const CONTENT_HORIZONTAL_PADDING = 52
const SELECT_ARROW_SPACE = 44
const SELECT_NUDGE = -2
const INPUT_HEIGHT = 52
const INPUT_PADDING_VERTICAL = 14
const INPUT_PADDING_HORIZONTAL = 21
const ERROR_SPACE = 20

const formGroupOverrides = {
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
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: LABEL_MARGIN_BOTTOM,
  },
  '& .form-group div[class*="col"]': {
    flex: '0 0 100%',
    width: '100%',
    maxWidth: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },
  '& .input-group': {
    margin: 0,
  },
}

export const useStyles = makeStyles<ScimFormPageStylesParams>()((
  theme: Theme,
  { isDark: _isDark, themeColors },
) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor

  return {
    formCard: {
      backgroundColor: cardBg,
      border: 'none',
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: '100%',
      minHeight: FORM_CARD_MIN_HEIGHT,
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    content: {
      paddingTop: SPACING.PAGE,
      paddingLeft: CONTENT_HORIZONTAL_PADDING,
      paddingRight: CONTENT_HORIZONTAL_PADDING,
      paddingBottom: SPACING.CONTENT_PADDING,
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },
    formSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      width: '100%',
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
      alignItems: 'start',
      minWidth: 0,
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
    fieldItem: {
      'width': '100%',
      'minWidth': 0,
      'boxSizing': 'border-box',
      ...formGroupOverrides,
      '& .form-group div[class*="col"]': {
        ...formGroupOverrides['& .form-group div[class*="col"]'],
        position: 'relative',
        paddingBottom: ERROR_SPACE,
      },
      '& [data-field-error]': {
        position: 'absolute',
        fontSize: `${fontSizes.sm} !important`,
      },
    },
    fieldItemFullWidth: {
      'width': '100%',
      'gridColumn': '1 / -1',
      'boxSizing': 'border-box',
      ...formGroupOverrides,
      '& .form-group div[class*="col"]': {
        ...formGroupOverrides['& .form-group div[class*="col"]'],
        position: 'relative',
        paddingBottom: ERROR_SPACE,
      },
      '& [data-field-error]': {
        position: 'absolute',
        fontSize: `${fontSizes.sm} !important`,
      },
    },
    togglesRow: {
      'gridColumn': '1 / -1',
      'display': 'flex',
      'gap': SPACING.SECTION_GAP,
      'alignItems': 'flex-start',
      'minWidth': 0,
      '& > div': {
        flex: '1 1 0',
        minWidth: 0,
      },
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
      },
    },
    formLabels: {
      '& label, & label h5, & label h5 span, & label .MuiSvgIcon-root': {
        color: `${themeColors.fontColor} !important`,
        fontFamily: `${fontFamily} !important`,
        fontSize: `${fontSizes.base} !important`,
        fontStyle: 'normal',
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
      '& input:focus, & input:active, & select:focus, & select:active': {
        backgroundColor: `${formInputBg} !important`,
        color: `${themeColors.fontColor} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        outline: 'none',
        boxShadow: 'none',
      },
      '& input:disabled, & select:disabled': {
        backgroundColor: `${alpha(formInputBg, OPACITY.DISABLED)} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        cursor: 'not-allowed',
      },
      '& input::placeholder': {
        color: `${themeColors.textMuted} !important`,
        opacity: OPACITY.PLACEHOLDER,
      },
      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
        WebkitBoxShadow: `0 0 0 100px ${formInputBg} inset !important`,
        WebkitTextFillColor: `${themeColors.fontColor} !important`,
        backgroundColor: `${formInputBg} !important`,
        transition: 'background-color 5000s ease-in-out 0s',
      },
    },
  }
})
