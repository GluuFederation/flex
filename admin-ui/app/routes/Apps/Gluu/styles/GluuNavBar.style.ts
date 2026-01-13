import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontWeights, fontSizes, letterSpacing } from '@/styles/fonts'

interface NavbarColors {
  background: string
  border: string
  text: string
  icon: string
}

export const useNewNavbarStyles = (navbarColors: NavbarColors) => {
  return makeStyles()((theme) => ({
    navbarWrapper: {
      height: '106px',
      width: '100%',
      backgroundColor: `${navbarColors.background} !important`,
      borderBottom: `1px solid ${navbarColors.border} !important`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0px 60px',
      position: 'relative',
      [theme.breakpoints.down('md')]: {
        padding: '0px 20px',
        height: '80px',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '0px 15px',
        height: '70px',
      },
    },
    navLeft: {
      display: 'flex',
      alignItems: 'center',
    },
    pageTitle: {
      fontFamily,
      fontSize: fontSizes['3xl'],
      fontWeight: fontWeights.bold,
      color: `${navbarColors.text} !important`,
      margin: 0,
      padding: '0px',
      [theme.breakpoints.down('md')]: {
        fontSize: fontSizes.lg,
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: fontSizes.md,
      },
    },
    navbarContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '19px',
      [theme.breakpoints.down('md')]: {
        gap: '12px',
      },
      [theme.breakpoints.down('sm')]: {
        gap: '8px',
      },
    },
    dropdownWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconButton: {
      width: '32px',
      height: '32px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      [theme.breakpoints.down('sm')]: {
        width: '28px',
        height: '28px',
      },
    },
    languageMenuWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    userProfileContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      minWidth: '156px',
      [theme.breakpoints.down('md')]: {
        gap: '8px',
        minWidth: 'auto',
      },
      [theme.breakpoints.down('sm')]: {
        gap: '6px',
      },
    },
    userName: {
      fontFamily,
      fontSize: '15px',
      fontWeight: fontWeights.medium,
      color: navbarColors.text,
      letterSpacing: letterSpacing.normal,
      lineHeight: 'normal',
      width: '84px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      [theme.breakpoints.down('md')]: {
        fontSize: fontSizes.base,
        width: '70px',
      },
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    userChevron: {
      width: '18px',
      height: '18px',
      color: navbarColors.icon,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      [theme.breakpoints.down('sm')]: {
        width: '16px',
        height: '16px',
      },
    },
  }))
}
