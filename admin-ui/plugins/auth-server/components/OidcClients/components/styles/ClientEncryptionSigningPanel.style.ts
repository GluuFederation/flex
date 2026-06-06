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
import { getAccordionStyles } from '@/styles/accordionStyles'
import { createClientFormLayoutStyles } from './clientFormLayout'
import type { ThemeConfig } from '@/context/theme/config'

type ClientEncryptionSigningPanelStyleParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const SELECT_ARROW_SPACE = 44
const ERROR_SPACE = 20

export const useStyles = makeStyles<ClientEncryptionSigningPanelStyleParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const fontColor = themeColors.fontColor
  const formGroupBase = createFormGroupOverrides({ columnPaddingBottom: ERROR_SPACE })
  const layoutStyles = createClientFormLayoutStyles(theme, formGroupBase)
  const inputColors = {
    inputBg: formInputBg,
    inputBorderColor,
    fontColor,
    textMuted: themeColors.textMuted,
  }
  const accordionStyles = getAccordionStyles(
    isDark,
    themeColors,
    fontColor,
    formInputBg,
    inputBorderColor,
  )

  return {
    root: {
      ...layoutStyles.root,
      ...accordionStyles,
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
    },
    accordionSpacing: {
      marginBottom: SPACING.CARD_CONTENT_GAP,
    },
    fieldsGrid: layoutStyles.fieldsGrid,
    fieldItem: layoutStyles.fieldItem,
    fieldItemFullWidth: layoutStyles.fieldItemFullWidth,
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
          opacity: OPACITY.DISABLED,
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
