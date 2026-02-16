import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'

const useStyles = makeStyles<{ themeColors: ThemeConfig }>()((theme, { themeColors }) => ({
  card: {
    minWidth: 275,
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: themeColors.card.background,
    border: `1px solid ${themeColors.formFooter.back.borderColor}`,
    borderRadius: '8px',
    boxShadow: 'none',
  },
  cardContent: {
    paddingBottom: theme.spacing(1),
  },
  title: {
    color: themeColors.fontColor,
    fontFamily: 'Mona-Sans, sans-serif',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: 'normal',
    letterSpacing: '0.4px',
    marginBottom: theme.spacing(1),
  },
  description: {
    color: themeColors.textMuted,
    fontFamily,
    fontSize: fontSizes.description,
    fontStyle: 'normal',
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.base,
    letterSpacing: letterSpacing.normal,
    marginBottom: theme.spacing(1),
  },
  cardActions: {
    padding: theme.spacing(1, 2, 2, 2),
  },
  button: {
    'display': 'inline-flex',
    'height': '40px',
    'padding': '20px 28px',
    'justifyContent': 'center',
    'alignItems': 'center',
    'borderRadius': '6px',
    'border': `1px solid ${themeColors.formFooter.back.borderColor}`,
    'backgroundColor': themeColors.formFooter.back.backgroundColor,
    'color': themeColors.formFooter.back.textColor,
    'fontFamily': 'Mona-Sans, sans-serif',
    'fontSize': '14px',
    'fontWeight': 700,
    'cursor': 'pointer',
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
  },
}))

export default useStyles
