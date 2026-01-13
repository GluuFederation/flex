import { makeStyles } from 'tss-react/mui'

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
      padding: '0 60px',
      position: 'relative',
      [theme.breakpoints.down('md')]: {
        padding: '0 20px',
        height: '80px',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '0 15px',
        height: '70px',
      },
    },
    navLeft: {
      display: 'flex',
      alignItems: 'center',
    },
    pageTitle: {
      fontFamily: "'Mona-Sans', sans-serif",
      fontSize: '24px',
      fontWeight: 700,
      color: `${navbarColors.text} !important`,
      margin: 0,
      padding: 0,
      [theme.breakpoints.down('md')]: {
        fontSize: '20px',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
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
      fontFamily: "'Mona-Sans', sans-serif",
      fontSize: '15px',
      fontWeight: 500,
      color: navbarColors.text,
      letterSpacing: '0.3px',
      lineHeight: 'normal',
      width: '84px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
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
