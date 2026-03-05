import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { CEDARLING_CONFIG_SPACING, MAPPING_SPACING, BORDER_RADIUS } from '@/constants'
import { fontFamily, fontSizes, fontWeights, letterSpacing } from '@/styles/fonts'
import customColors from '@/customColors'

interface UserFormStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<UserFormStylesParams>()((_, { isDark, themeColors }) => {
  const settings = themeColors.settings
  const formInputBg = settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor = settings?.inputBorder ?? themeColors.borderColor

  return {
    formRoot: {
      fontFamily,
      display: 'flex',
      alignItems: 'stretch',
      flexWrap: 'wrap' as const,

      '& > [class*="col-"]': {
        display: 'flex',
        flexDirection: 'column',
      },

      '& label, & label h5, & label span, & label .MuiSvgIcon-root, & h5': {
        color: `${themeColors.fontColor} !important`,
        fontFamily: `${fontFamily} !important`,
        fontSize: `${fontSizes.base} !important`,
        fontStyle: 'normal !important',
        fontWeight: `${fontWeights.semiBold} !important`,
        lineHeight: 'normal !important',
        letterSpacing: `${letterSpacing.normal} !important`,
        margin: '0 !important',
      },

      '& input::placeholder, & textarea::placeholder': {
        color: `${themeColors.textMuted} !important`,
      },

      '& input, & select, & textarea, & .custom-select': {
        backgroundColor: `${formInputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        borderRadius: 0,
        color: `${themeColors.fontColor} !important`,
        caretColor: themeColors.fontColor,
        minHeight: CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
        height: 'auto',
        paddingTop: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingBottom: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingLeft: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
        paddingRight: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
      },

      '& select, & .custom-select': {
        paddingRight: 44,
      },

      '& input:focus, & input:active, & select:focus, & select:active, & textarea:focus, & textarea:active, & .custom-select:focus, & .custom-select:active, & .form-control:focus, & .form-control:active':
        {
          outline: 'none !important',
          boxShadow: 'none !important',
        },

      '& input:disabled, & select:disabled, & textarea:disabled, & .custom-select:disabled': {
        opacity: 1,
        cursor: 'not-allowed',
      },

      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active':
        {
          WebkitBoxShadow: `0 0 0 100px ${formInputBg} inset !important`,
          WebkitTextFillColor: `${themeColors.fontColor} !important`,
          color: `${themeColors.fontColor} !important`,
          backgroundColor: `${formInputBg} !important`,
          transition: 'background-color 5000s ease-in-out 0s',
        },
    },

    leftStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      minWidth: 0,
      flex: 1,
    },
    sectionCard: {
      backgroundColor: isDark
        ? '#15395D'
        : (themeColors.settings?.cardBackground ?? themeColors.card.background),
      border: `1px solid ${themeColors.borderColor}`,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: 20,
      boxSizing: 'border-box',
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: 18,
      '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
      },
    },
    fullRow: {
      gridColumn: '1 / -1',
    },
    roleCard: {
      backgroundColor: formInputBg,
      border: `1px solid ${inputBorderColor}`,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: 16,
      boxSizing: 'border-box',
      '& .rbt .form-control': {
        borderRadius: '0 !important',
      },
    },
    roleHeader: {
      color: themeColors.fontColor,
      fontWeight: 600,
      marginBottom: 12,
    },
    roleControls: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto auto',
      gap: 12,
      alignItems: 'center',
      '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
      },
    },
    roleButtons: {
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
      '@media (max-width: 900px)': {
        justifyContent: 'flex-start',
      },
    },
    roleTags: {
      marginTop: 12,
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
    },
    roleTag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 999,
      backgroundColor: customColors.statusActiveBg,
      color: customColors.statusActive,
      border: `1px solid ${customColors.statusActive}`,
      fontSize: 12,
      lineHeight: '18px',
      fontWeight: 600,
    },
    claimsPanelWrap: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    changePasswordRow: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
  }
})

