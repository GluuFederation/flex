import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'

const styles = makeStyles<{ isDark: boolean }>()((theme, { isDark }) => ({
  dialog: {
    padding: theme.spacing(5),
    borderRadius: 20,
    width: 550,
    minHeight: 259,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
    backgroundImage: 'none',
    boxSizing: 'border-box',
  },
  title: {
    fontFamily: 'Mona-Sans, sans-serif',
    fontSize: '36px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '45px',
    color: isDark ? customColors.white : customColors.darkBackground,
    paddingBottom: theme.spacing(0.5),
  },
  contentText: {
    fontFamily: 'Mona-Sans, sans-serif',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '0.36px',
    color: isDark ? customColors.textMutedDark : customColors.textSecondary,
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
    color: customColors.white,
    backgroundColor: customColors.statusActive,
  },
  continue: {
    'color': isDark ? customColors.white : customColors.primaryDark,
    'borderColor': isDark ? `rgba(${hexToRgb(customColors.white)}, 0.3)` : customColors.lightBorder,
    'backgroundColor': 'transparent',
    '&:hover': {
      color: isDark ? customColors.white : customColors.primaryDark,
      backgroundColor: 'transparent',
      borderColor: isDark ? `rgba(${hexToRgb(customColors.white)}, 0.3)` : customColors.lightBorder,
    },
  },
}))

export default styles
