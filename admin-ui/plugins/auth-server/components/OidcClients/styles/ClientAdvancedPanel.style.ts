import { makeStyles } from 'tss-react/mui'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS, OPACITY } from '@/constants'
import {
  createFormGroupOverrides,
  createFormLabelStyles,
  createFormInputStyles,
  createFormInputFocusStyles,
  createFormInputAutofillStyles,
} from '@/styles/formStyles'
import type { ThemeConfig } from '@/context/theme/config'

type ClientAdvancedPanelStyleParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const SELECT_ARROW_SPACE = 44
const SELECT_NUDGE = -2
const ERROR_SPACE = 20

export const useStyles = makeStyles<ClientAdvancedPanelStyleParams>()((
  theme: Theme,
  { themeColors },
) => {
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const formGroupBase = createFormGroupOverrides({ columnPaddingBottom: ERROR_SPACE })
  const inputColors = {
    inputBg: formInputBg,
    inputBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
  }

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.SECTION_GAP,
      width: '100%',
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
      alignItems: 'start',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
    fieldItem: {
      width: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
      ...formGroupBase,
    },
    fieldItemFullWidth: {
      width: '100%',
      minWidth: 0,
      gridColumn: '1 / -1',
      boxSizing: 'border-box',
      ...formGroupBase,
    },
    formLabels: createFormLabelStyles(themeColors.fontColor),
    formWithInputs: {
      '& input:not(.MuiInputBase-input):not(.gluu-dynamic-list-input), & select, & .custom-select, & textarea':
        {
          ...createFormInputStyles(inputColors),
          backgroundColor: `${formInputBg} !important`,
          borderRadius: BORDER_RADIUS.SMALL,
        },
      '& select, & .custom-select': {
        paddingRight: SELECT_ARROW_SPACE,
        marginTop: SELECT_NUDGE,
        marginBottom: SELECT_NUDGE,
      },
      '& input:not(.MuiInputBase-input):not(.gluu-dynamic-list-input):focus, & input:not(.MuiInputBase-input):not(.gluu-dynamic-list-input):focus-visible, & input:not(.MuiInputBase-input):not(.gluu-dynamic-list-input):active, & select:focus, & select:focus-visible, & select:active, & .form-control:not(.gluu-dynamic-list-input):focus, & .input-group:focus-within':
        {
          ...createFormInputFocusStyles(inputColors),
          backgroundColor: `${formInputBg} !important`,
          borderRadius: `${BORDER_RADIUS.SMALL}px !important`,
          outline: 'none !important',
          boxShadow: 'none !important',
        },
      '& input:not(.MuiInputBase-input):not(.gluu-dynamic-list-input):disabled, & select:disabled, & textarea:disabled':
        {
          backgroundColor: `${alpha(formInputBg, OPACITY.DISABLED)} !important`,
          color: `${themeColors.fontColor} !important`,
          cursor: 'not-allowed',
        },
      '& input:not(.MuiInputBase-input):not(.gluu-dynamic-list-input)::placeholder, & textarea::placeholder':
        {
          color: `${themeColors.textMuted} !important`,
          opacity: OPACITY.PLACEHOLDER,
        },
      '& input:not(.MuiInputBase-input):not(.gluu-dynamic-list-input):-webkit-autofill, & input:not(.MuiInputBase-input):not(.gluu-dynamic-list-input):-webkit-autofill:hover, & input:not(.MuiInputBase-input):not(.gluu-dynamic-list-input):-webkit-autofill:focus':
        {
          ...createFormInputAutofillStyles(inputColors),
          backgroundColor: `${formInputBg} !important`,
        },
    },
  }
})
