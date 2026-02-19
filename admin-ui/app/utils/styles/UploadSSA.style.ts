import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { MAPPING_SPACING } from '@/constants/ui'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'

const useStyles = makeStyles<{ themeColors: ThemeConfig }>()((theme, { themeColors }) => ({
  logo: {
    maxWidth: 200,
  },
  label: {
    color: themeColors.fontColor,
    fontFamily,
    fontSize: fontSizes.description,
    fontStyle: 'normal',
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    marginBottom: theme.spacing(3),
  },
  dropzone: {
    'marginTop': theme.spacing(1),
    'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
    'border': `1px solid ${themeColors.infoAlert.border}`,
    'background': themeColors.infoAlert.background,
    '&:hover': {
      borderRadius: `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      border: `1px solid ${themeColors.infoAlert.border}`,
      background: themeColors.infoAlert.background,
    },
  },
  error: {
    color: themeColors.errorColor,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    marginTop: theme.spacing(2),
    display: 'block',
  },
  dropzoneText: {
    color: themeColors.infoAlert.text,
    fontFamily,
    fontSize: fontSizes.base,
    fontStyle: 'normal',
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
  },
  button: {
    display: 'inline-flex',
    height: '40px',
    padding: '20px 28px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
    border: `1px solid ${themeColors.formFooter.back.borderColor}`,
    backgroundColor: themeColors.formFooter.back.backgroundColor,
    color: themeColors.formFooter.back.textColor,
    fontFamily,
    fontSize: fontSizes.base,
    fontStyle: 'normal',
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.button,
  },
}))

export default useStyles
