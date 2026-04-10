import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'
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

  const formGroupWithErrors = createFormGroupOverrides({ columnPaddingBottom: 16 })
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

      '& input:not(.MuiOutlinedInput-input), & select, & textarea, & .custom-select':
        createFormInputStyles(inputColors),

      '& select, & .custom-select': {
        paddingRight: 44,
      },

      '& input:focus, & input:active, & select:focus, & select:active, & textarea:focus, & textarea:active, & .custom-select:focus, & .custom-select:active, & .form-control:focus, & .form-control:active':
        createFormInputFocusStyles(inputColors),

      '& input:disabled, & select:disabled, & textarea:disabled, & .custom-select:disabled': {
        opacity: 1,
        cursor: 'not-allowed',
      },

      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active':
        createFormInputAutofillStyles(inputColors),

      // Align GluuMultiSelectRow trigger bg with other form inputs
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
      'rowGap': 0,
      '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
      },
      ...formGroupWithErrors,
      '& .form-group': {
        ...formGroupWithErrors['& .form-group'],
        paddingBottom: SPACING.CARD_CONTENT_GAP,
      },
      '& > div:not(.form-group)': {
        paddingBottom: SPACING.CARD_CONTENT_GAP,
      },
    },
    fullRow: {
      gridColumn: '1 / -1',
    },
    autocompleteFieldWrap: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
    },
    autocompleteCardWrap: {
      '& > div': {
        paddingBottom: SPACING.SECTION_GAP,
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
      ...formGroupWithErrors,
      '& .form-group': {
        ...formGroupWithErrors['& .form-group'],
        paddingBottom: 0,
      },
    },
  }
})
