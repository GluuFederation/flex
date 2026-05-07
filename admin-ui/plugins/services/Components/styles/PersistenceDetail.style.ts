import { makeStyles } from 'tss-react/mui'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS, OPACITY } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'

interface PersistenceDetailStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

const INPUT_HEIGHT = 52
const INPUT_PADDING_VERTICAL = 14
const INPUT_PADDING_HORIZONTAL = 21
const SELECT_ARROW_SPACE = 44
const SELECT_NUDGE = -2
const LABEL_MARGIN_BOTTOM = 2
const ERROR_SPACE = 12

export const useStyles = makeStyles<PersistenceDetailStylesParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const settings = themeColors.settings
  const formInputBg = settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = settings?.inputBorder ?? themeColors.borderColor

  return {
    persistenceCard: {
      backgroundColor: settings?.cardBackground ?? themeColors.card.background,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: '100%',
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    content: {
      padding: SPACING.CONTENT_PADDING,
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
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
      'boxSizing': 'border-box' as const,
      '& .form-group': {
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
      },
      '& .form-group.row': {
        marginLeft: 0,
        marginRight: 0,
        flexDirection: 'column' as const,
        flexWrap: 'nowrap' as const,
      },
      '& .form-group > label': {
        flex: '0 0 auto',
        width: '100%',
        maxWidth: '100%',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: `${LABEL_MARGIN_BOTTOM}px !important`,
      },
      '& .form-group > label h5, & .form-group > label h5 span': {
        margin: '0 !important',
      },
      '& .form-group [class*="col"]': {
        flex: '0 0 100%',
        width: '100%',
        maxWidth: '100%',
        paddingLeft: 0,
        paddingRight: 0,
        position: 'relative',
        paddingBottom: ERROR_SPACE,
        minWidth: 0,
        boxSizing: 'border-box',
      },
      '& .input-group': {
        margin: 0,
      },
      '& [data-field-error]': {
        position: 'absolute',
        fontSize: `${fontSizes.sm} !important`,
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
      '& input:focus, & input:focus-visible, & input:active, & select:focus, & select:focus-visible, & select:active, & .form-control:focus, & .input-group:focus-within':
        {
          backgroundColor: `${formInputBg} !important`,
          color: `${themeColors.fontColor} !important`,
          border: `1px solid ${inputBorderColor} !important`,
          borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
          outline: 'none !important',
          boxShadow: 'none !important',
        },
      '& input:disabled, & select:disabled': {
        backgroundColor: `${alpha(formInputBg, OPACITY.DISABLED)} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: OPACITY.DISABLED,
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
    divider: {
      height: 1,
      backgroundColor: isDark ? customColors.darkBorder : customColors.lightBorder,
      border: 'none',
      margin: 0,
    },
  }
})
