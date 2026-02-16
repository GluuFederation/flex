import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'

const styles = makeStyles<{ themeColors: ThemeConfig }>()((theme, { themeColors }) => ({
  dialog: {
    padding: theme.spacing(5),
    borderRadius: 20,
    width: 550,
    minHeight: 259,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: themeColors.card?.background ?? themeColors.background,
    backgroundImage: 'none',
    boxSizing: 'border-box',
  },
  title: {
    fontFamily: 'Mona-Sans, sans-serif',
    fontSize: '36px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '45px',
    color: themeColors.fontColor,
    paddingBottom: theme.spacing(0.5),
  },
  contentText: {
    fontFamily: 'Mona-Sans, sans-serif',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '0.36px',
    color: themeColors.textMuted,
    marginBottom: theme.spacing(0.5),
  },
  actionArea: {
    padding: theme.spacing(0.5, 0),
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  button: {
    borderRadius: 8,
    textTransform: 'none',
    padding: theme.spacing(1, 4),
    fontFamily: 'Mona-Sans, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
  },
  logout: {
    color: themeColors.settings?.removeButton?.text ?? themeColors.formFooter?.back?.textColor,
    backgroundColor:
      themeColors.settings?.removeButton?.bg ?? themeColors.formFooter?.back?.backgroundColor,
  },
  continue: {
    'color': themeColors.fontColor,
    'borderColor': themeColors.borderColor,
    'backgroundColor': 'transparent',
    '&:hover': {
      color: themeColors.fontColor,
      backgroundColor: themeColors.lightBackground,
      borderColor: themeColors.borderColor,
    },
  },
}))

export default styles
