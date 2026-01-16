import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, letterSpacing, lineHeights } from '@/styles/fonts'

interface StylesParams {
  isDark: boolean
}

export const useStyles = makeStyles<StylesParams>()((_theme, { isDark }) => ({
  container: {
    maxWidth: '100%',
    padding: 0,
  },
  pageTitle: {
    fontFamily,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['3xl'],
    color: isDark ? customColors.white : customColors.primaryDark,
    marginBottom: '53px',
    marginTop: 0,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  infoBox: {
    backgroundColor: isDark ? customColors.infoBoxBgDark : customColors.infoBoxBgLight,
    border: `1px solid ${isDark ? customColors.infoBoxBorderDark : customColors.infoBoxBorderLight}`,
    borderRadius: '6px',
    padding: '22px 25px 22px 56px',
    marginBottom: '40px',
    position: 'relative',
    minHeight: '254px',
  },
  infoIcon: {
    position: 'absolute',
    left: '25px',
    top: '22px',
    width: '24px',
    height: '24px',
    color: isDark ? customColors.infoBoxTextDark : customColors.infoBoxTextLight,
  },
  infoContent: {
    fontFamily,
    'fontWeight': fontWeights.medium,
    'fontSize': fontSizes.base,
    'lineHeight': lineHeights.tight,
    'color': isDark ? customColors.infoBoxTextDark : customColors.infoBoxTextLight,
    '& p': {
      'marginBottom': '0px',
      'lineHeight': lineHeights.tight,
      '&:last-child': {
        marginBottom: 0,
      },
    },
  },
  infoLink: {
    'color': isDark ? customColors.white : customColors.primaryDark,
    'fontWeight': fontWeights.medium,
    'textDecoration': 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  inputContainer: {
    marginBottom: '52px',
    position: 'relative',
  },
  inputLabel: {
    fontFamily,
    fontWeight: fontWeights.semiBold,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    color: isDark ? customColors.white : customColors.primaryDark,
    marginBottom: '7px',
    display: 'block',
  },
  inputField: {
    'width': '100%',
    'height': '52px',
    'borderRadius': isDark ? '8px' : '6px',
    'backgroundColor': isDark ? customColors.darkInputBg : customColors.white,
    'border': `1px solid ${isDark ? 'transparent' : customColors.borderInput}`,
    'padding': '0px 21px',
    fontFamily,
    'fontWeight': fontWeights.medium,
    'fontSize': fontSizes.base,
    'color': isDark ? customColors.white : customColors.textSecondary,
    '&::placeholder': {
      color: isDark ? customColors.white : customColors.textSecondary,
      opacity: 1,
    },
    '&:focus': {
      outline: 'none',
      borderColor: isDark ? customColors.darkBorderAccent : customColors.borderInput,
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  inputError: {
    borderColor: customColors.accentRed,
  },
  errorText: {
    fontFamily,
    fontSize: fontSizes.xs,
    color: customColors.accentRed,
    marginTop: '4px',
  },
  radioContainer: {
    marginBottom: '50px',
  },
  radioLabel: {
    fontFamily,
    fontWeight: fontWeights.semiBold,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    color: isDark ? customColors.white : customColors.primaryDark,
    marginBottom: '0px',
    display: 'block',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    gap: '25px',
    marginTop: '8px',
    marginBottom: '8px',
  },
  radioOption: {
    'display': 'flex',
    'alignItems': 'center',
    'gap': '13px',
    'cursor': 'pointer',
    '& input[type="radio"]': {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
    },
  },
  radioLabelText: {
    fontFamily,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.relaxed,
    color: isDark ? customColors.radioTextDark : customColors.textSecondary,
    cursor: 'pointer',
  },
  descriptionText: {
    fontFamily,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.tight,
    color: isDark ? customColors.descriptionTextDark : customColors.descriptionTextLight,
    marginTop: 0,
    marginBottom: 0,
  },
  buttonContainer: {
    display: 'flex',
    gap: '16px',
    marginTop: '31px',
  },
  backButton: {
    'backgroundColor': customColors.statusActive,
    'color': customColors.white,
    fontFamily,
    'fontWeight': fontWeights.bold,
    'fontSize': fontSizes.base,
    'letterSpacing': letterSpacing.tight,
    'height': '40px',
    'padding': '10px 28px',
    'borderRadius': '6px',
    'border': 'none',
    'cursor': 'pointer',
    '&:hover': {
      opacity: 0.9,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  applyButton: {
    'backgroundColor': isDark ? customColors.white : customColors.primaryDark,
    'color': isDark ? customColors.primaryDark : customColors.white,
    fontFamily,
    'fontWeight': fontWeights.bold,
    'fontSize': fontSizes.base,
    'letterSpacing': letterSpacing.tight,
    'height': '40px',
    'padding': '10px 28px',
    'borderRadius': '6px',
    'border': 'none',
    'cursor': 'pointer',
    '&:hover': {
      opacity: 0.9,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
}))
