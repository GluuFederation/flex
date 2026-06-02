import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, OPACITY, SPACING } from '@/constants'
import { fontFamily, fontSizes } from '@/styles/fonts'
import {
  createFormGroupOverrides,
  createFormLabelStyles,
  createFormInputStyles,
  createFormInputFocusStyles,
  createFormInputAutofillStyles,
} from '@/styles/formStyles'

type SsaFormStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<SsaFormStylesParams>()((_, { isDark, themeColors }) => {
  const settings = themeColors.settings
  const inputBorderColor = settings?.inputBorder ?? themeColors.borderColor
  const inputBg = themeColors.inputBackground
  const inputColors = {
    inputBg,
    inputBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
  }

  const formGroupNoErrors = createFormGroupOverrides()

  return {
    formRoot: {
      fontFamily,
      'display': 'flex',
      'alignItems': 'stretch',
      'flexWrap': 'wrap' as const,

      '& > [class*="col-"]': {
        display: 'flex',
        flexDirection: 'column',
      },

      ...createFormLabelStyles(themeColors.fontColor),

      '& input::placeholder, & textarea::placeholder': {
        color: `${themeColors.textMuted} !important`,
      },

      '& input:not(.MuiOutlinedInput-input):not(.react-toggle-screenreader-only), & select, & textarea, & .custom-select':
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

      '& [role="combobox"]': {
        backgroundColor: `${inputBg} !important`,
      },
    },

    leftStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.CARD_CONTENT_GAP,
      minWidth: 0,
      flex: 1,
    },
    sectionCard: {
      'backgroundColor': isDark
        ? (settings?.cardBackground ?? themeColors.card.background)
        : themeColors.background,
      'border': isDark ? 'none' : `1px solid ${themeColors.borderColor}`,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'padding': 20,
      'boxSizing': 'border-box',
      'display': 'flex',
      'flexDirection': 'column',
      'gap': SPACING.CARD_CONTENT_GAP,
      ...formGroupNoErrors,
      '& > .form-group [data-field-error]': {
        display: 'none !important',
      },
    },
    fieldsGrid: {
      'display': 'grid',
      'gridTemplateColumns': 'repeat(2, minmax(0, 1fr))',
      'columnGap': SPACING.SECTION_GAP,
      'rowGap': SPACING.SECTION_GAP,
      'alignItems': 'start' as const,
      '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
      },
      ...formGroupNoErrors,
      '& .form-group > label': {
        ...formGroupNoErrors['& .form-group > label'],
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '4px !important',
      },
      '& .form-group > label[class*="col"]': {
        flexBasis: 'auto',
        flexGrow: 0,
        flexShrink: 0,
        position: 'static' as const,
        paddingBottom: '0 !important',
      },
    },
    fullRow: {
      gridColumn: '1 / -1',
    },
    toggleCell: {
      'minWidth': 0,
      'boxSizing': 'border-box' as const,
      ...createFormGroupOverrides(),
      '& .form-group > label': {
        ...createFormGroupOverrides()['& .form-group > label'],
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '2px !important',
      },
      '& .form-group [class*="col"]': {
        boxSizing: 'border-box' as const,
      },
    },
    autocompleteFieldWrap: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
    },
    autocompleteCardWrap: {
      'width': '100%',
      '& > div': {
        padding: '12px !important',
        width: '100%',
        boxSizing: 'border-box' as const,
      },
      '& > div > div:first-child': {
        marginBottom: '4px !important',
      },
      '& > div > div:nth-of-type(2)': {
        display: 'block !important',
        width: '100%',
      },
      '& > div > div:nth-of-type(2) > div': {
        width: '100%',
      },
      '& .MuiAutocomplete-root, & .MuiFormControl-root, & .MuiOutlinedInput-root': {
        width: '100% !important',
      },
      '& .MuiOutlinedInput-root [role="combobox"]': {
        backgroundColor: 'transparent !important',
      },
    },
    autocompleteFieldError: {
      display: 'block',
      color: themeColors.errorColor,
      fontSize: fontSizes.sm,
      marginTop: SPACING.CARD_CONTENT_GAP / 2,
    },
    datePickerCell: {
      'display': 'flex',
      'alignItems': 'center',
      '& .MuiInputBase-root': {
        backgroundColor: `${inputBg} !important`,
      },
    },
    claimsPanelWrap: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    dynamicClaimsWrap: {
      'display': 'flex',
      'flexDirection': 'column',
      'gap': 0,
      '& > *': {
        paddingBottom: SPACING.CARD_CONTENT_GAP,
      },
      ...formGroupNoErrors,
      '& .form-group': {
        ...formGroupNoErrors['& .form-group'],
        paddingBottom: 0,
      },
    },
  }
})
