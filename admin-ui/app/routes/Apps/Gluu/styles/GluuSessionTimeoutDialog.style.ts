import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

const styles = makeStyles<{ isDark: boolean }>()((theme, { isDark }) => ({
  dialog: {
    padding: theme.spacing(5),
    borderRadius: 20,
    width: 550,
    height: 259,
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
    color: isDark ? '#FFF' : '#0B2947',
    paddingBottom: theme.spacing(0.5),
  },
  contentText: {
    fontFamily: 'Mona-Sans, sans-serif',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '0.36px',
    color: isDark ? '#819EBC' : '#425466',
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
    fontSize: ' 16px',
    fontWeight: 600,
  },
  logout: {
    color: customColors.white,
    backgroundColor: customColors.statusActive,
  },
  continue: {
    'color': isDark ? customColors.white : customColors.primaryDark,
    'borderColor': isDark ? 'rgba(255, 255, 255, 0.3)' : '#D0D5DD',
    'backgroundColor': 'transparent',
    '&:hover': {
      color: isDark ? customColors.white : customColors.primaryDark,
      backgroundColor: 'transparent',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : '#D0D5DD',
    },
  },
}))

export default styles
