import { makeStyles } from 'tss-react/mui'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS, OPACITY } from '@/constants'
import type { ThemeConfig } from '@/context/theme/config'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import {
  createFormGroupOverrides,
  createFormLabelStyles,
  createFormInputStyles,
  createFormInputFocusStyles,
  createFormInputAutofillStyles,
} from '@/styles/formStyles'

type ScimFormPageStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const FORM_CARD_MIN_HEIGHT = 400
const CONTENT_HORIZONTAL_PADDING = 52
const SELECT_ARROW_SPACE = 44
const SELECT_NUDGE = -2
const ERROR_SPACE = 20

const formGroupBase = createFormGroupOverrides()

export const useStyles = makeStyles<ScimFormPageStylesParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const inputColors = {
    inputBg: formInputBg,
    inputBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
  }

  return {
    formCard: {
      'backgroundColor': `${cardBg} !important`,
      ...getCardBorderStyle({ isDark }),
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'width': '100%',
      'minHeight': FORM_CARD_MIN_HEIGHT,
      'position': 'relative',
      'overflow': 'visible',
      'display': 'flex',
      'flexDirection': 'column',
      'boxSizing': 'border-box',
      '& .card-body': {
        backgroundColor: `${cardBg} !important`,
        borderRadius: BORDER_RADIUS.DEFAULT,
      },
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
      ...formGroupBase,
      '& .form-group [class*="col"]': {
        ...formGroupBase['& .form-group [class*="col"]'],
        position: 'relative',
        paddingBottom: ERROR_SPACE,
      },
    },
    fieldItemFullWidth: {
      'width': '100%',
      'gridColumn': '1 / -1',
      'boxSizing': 'border-box',
      ...formGroupBase,
      '& .form-group [class*="col"]': {
        ...formGroupBase['& .form-group [class*="col"]'],
        position: 'relative',
        paddingBottom: ERROR_SPACE,
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
    formLabels: createFormLabelStyles(themeColors.fontColor),
    formWithInputs: {
      '& input, & select, & .custom-select': {
        ...createFormInputStyles(inputColors),
        backgroundColor: `${formInputBg} !important`,
        borderRadius: BORDER_RADIUS.SMALL,
      },
      '& select, & .custom-select': {
        paddingRight: SELECT_ARROW_SPACE,
        marginTop: SELECT_NUDGE,
        marginBottom: SELECT_NUDGE,
      },
      '& input:focus, & input:focus-visible, & input:active, & select:focus, & select:focus-visible, & select:active':
        {
          ...createFormInputFocusStyles(inputColors),
          outlineOffset: '0 !important',
        },
      '& input:disabled, & select:disabled': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        color: `${alpha(themeColors.fontColor, OPACITY.PLACEHOLDER)} !important`,
        cursor: 'not-allowed',
      },
      '& input::placeholder': {
        color: `${themeColors.textMuted} !important`,
        opacity: OPACITY.PLACEHOLDER,
      },
      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
        ...createFormInputAutofillStyles(inputColors),
        backgroundColor: `${formInputBg} !important`,
      },
    },
  }
})
