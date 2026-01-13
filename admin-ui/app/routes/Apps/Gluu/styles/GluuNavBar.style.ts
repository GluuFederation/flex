import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontWeights, fontSizes, letterSpacing } from '@/styles/fonts'

export interface NavbarColors {
  background: string
  border: string
  text: string
  icon: string
}

const useStyles = makeStyles<{ navbarColors: NavbarColors }>()((theme, { navbarColors }) => ({
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
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    height: '100%',
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
    height: '100%',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '19px',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      gap: '12px',
    },
    [theme.breakpoints.down('sm')]: {
      gap: '8px',
    },
  },
  navbarItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexShrink: 0,
  },
  iconButton: {
    width: '32px',
    height: '32px',
    minWidth: '32px',
    minHeight: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      width: '28px',
      height: '28px',
      minWidth: '28px',
      minHeight: '28px',
    },
  },
  languageMenuWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexShrink: 0,
  },
  userProfileContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    minWidth: '156px',
    height: '100%',
    flexShrink: 0,
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
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: `${navbarColors.text} !important`,
    letterSpacing: letterSpacing.normal,
    lineHeight: '1.5',
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0,
    padding: 0,
    display: 'block',
    flexShrink: 1,
    [theme.breakpoints.down('md')]: {
      fontSize: fontSizes.base,
      maxWidth: '150px',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  userIcon: {
    flexShrink: 0,
  },
  userChevron: {
    width: '18px',
    height: '18px',
    minWidth: '18px',
    minHeight: '18px',
    color: `${navbarColors.icon} !important`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      width: '16px',
      height: '16px',
      minWidth: '16px',
      minHeight: '16px',
    },
  },
}))

export const useNewNavbarStyles = ({ navbarColors }: { navbarColors: NavbarColors }) => {
  return useStyles({ navbarColors })
}
