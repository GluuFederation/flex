import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontSizes, fontWeights } from '@/styles/fonts'

const useStyles = makeStyles<{ themeColors: ThemeConfig }>()((_theme, { themeColors }) => ({
  'title': {
    color: themeColors.formFooter.back.backgroundColor,
    fontFamily: 'Mona-Sans, sans-serif',
    fontSize: '30px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '45px',
  },
  'error': {
    color: themeColors.errorColor,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
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
  'logo': {
    maxWidth: 200,
  },
  'cardWrapper': {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
  },
}))

export default useStyles
