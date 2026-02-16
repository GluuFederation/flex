import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'

const useStyles = makeStyles<{ themeColors: ThemeConfig }>()((theme, { themeColors }) => ({
  'logo': {
    maxWidth: 200,
  },
  'label': {
    color: themeColors.fontColor,
    fontFamily: 'Mona-Sans, sans-serif',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: 'normal',
    letterSpacing: '0.3px',
    marginBottom: theme.spacing(3),
  },
  'dropzone': {
    'marginTop': theme.spacing(1),
    'borderRadius': '6px',
    'border': `1px solid ${themeColors.infoAlert.border}`,
    'background': themeColors.infoAlert.background,
    '&:hover': {
      borderRadius: '6px',
      border: `1px solid ${themeColors.infoAlert.border}`,
      background: themeColors.infoAlert.background,
    },
  },
  'error': {
    color: themeColors.errorColor,
    marginTop: theme.spacing(2),
    display: 'block',
  },
  'dropzoneText': {
    color: themeColors.infoAlert.text,
    fontFamily: 'Mona-Sans, sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '22px',
  },
  'button': {
    display: 'inline-flex',
    height: '40px',
    padding: '20px 28px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '6px',
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
  'loaderOuter': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: themeColors.background,
    opacity: 0.9,
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'loader': {
    border: `4px solid ${themeColors.lightBackground}`,
    borderTop: `4px solid ${themeColors.formFooter.back.backgroundColor}`,
    borderRadius: '50%',
    width: 40,
    height: 40,
    animation: '$spin 2s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}))

export default useStyles
