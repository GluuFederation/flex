import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, OPACITY, SPACING } from '@/constants'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'
import {
  createFormGroupOverrides,
  createFormLabelStyles,
  createFormInputStyles,
  createFormInputFocusStyles,
  createFormInputAutofillStyles,
} from '@/styles/formStyles'

type UserFormStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<UserFormStylesParams>()((_, { isDark, themeColors }) => {
  const settings = themeColors.settings
  const inputBorderColor = settings?.inputBorder ?? themeColors.borderColor
  const inputBg = settings?.cardBackground ?? themeColors.card.background
  const inputColors = {
    inputBg,
    inputBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
  }

  const formGroupWithErrors = createFormGroupOverrides({ columnPaddingBottom: 16 })
  const formGroupNoErrors = createFormGroupOverrides()

  return {
    formRoot: {
      fontFamily,
      'display': 'flex',
      'alignItems': 'stretch',
      'flexWrap': 'wrap' as const,
      'width': '100%',
      'margin': '0 !important',

      '& > [class*="col-"]': {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      },

      ...createFormLabelStyles(themeColors.fontColor),

      '& input::placeholder, & textarea::placeholder': {
        color: `${themeColors.textMuted} !important`,
      },

      '& input:not(.MuiOutlinedInput-input), & select, & textarea, & .custom-select':
        createFormInputStyles(inputColors),

      '& select, & .custom-select': {
        paddingRight: 44,
      },

      '& input:focus, & input:active, & select:focus, & select:active, & textarea:focus, & textarea:active, & .custom-select:focus, & .custom-select:active, & .form-control:focus, & .form-control:active':
        createFormInputFocusStyles(inputColors),

      '& input:disabled, & select:disabled, & textarea:disabled, & .custom-select:disabled': {
        opacity: OPACITY.DISABLED,
        cursor: 'not-allowed',
      },

      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active':
        createFormInputAutofillStyles(inputColors),
    },

    leftStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.CARD_CONTENT_GAP,
      minWidth: 0,
      flex: 1,
    },
    sectionCard: {
      'backgroundColor': isDark ? themeColors.inputBackground : themeColors.background,
      'border': isDark ? 'none' : `1px solid ${themeColors.borderColor}`,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'padding': 20,
      'boxSizing': 'border-box',
      'display': 'flex',
      'flexDirection': 'column',
      'gap': SPACING.CARD_CONTENT_GAP,
      ...formGroupNoErrors,
      '& .form-group > label': {
        ...formGroupNoErrors['& .form-group > label'],
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '4px !important',
      },
      '& > .form-group [data-field-error]': {
        display: 'none !important',
      },
    },
    fieldsGrid: {
      'display': 'grid',
      'gridTemplateColumns': 'repeat(2, minmax(0, 1fr))',
      'columnGap': SPACING.SECTION_GAP,
      'rowGap': SPACING.CARD_CONTENT_GAP,
      '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
      },
      ...formGroupWithErrors,
      '& .form-group': {
        ...formGroupWithErrors['& .form-group'],
      },
      '& .form-group > label': {
        ...formGroupWithErrors['& .form-group > label'],
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '4px !important',
      },
      '& > div:not(.form-group)': {
        minWidth: 0,
      },
    },
    fullRow: {
      gridColumn: '1 / -1',
    },
    claimsPanelWrap: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    claimsPanelLayout: {
      display: 'flex',
      flexDirection: 'column',
    },
    changePasswordRow: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: SPACING.CARD_CONTENT_GAP,
    },
    dynamicClaimsWrap: {
      'display': 'flex',
      'flexDirection': 'column',
      'gap': 0,
      '& > * + *': {
        marginTop: SPACING.SECTION_GAP,
      },
      ...formGroupWithErrors,
      '& .form-group': {
        ...formGroupWithErrors['& .form-group'],
        paddingBottom: 0,
      },
      '& .form-group > label': {
        ...formGroupWithErrors['& .form-group > label'],
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '4px !important',
      },
    },
    changePasswordButton: {
      display: 'inline-flex',
      height: 44,
      padding: '8px 20px',
      justifyContent: 'center',
      alignItems: 'center',
      color: themeColors.fontColor,
      fontFamily,
      fontSize: fontSizes.base,
      fontStyle: 'normal',
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.button,
    },
  }
})
