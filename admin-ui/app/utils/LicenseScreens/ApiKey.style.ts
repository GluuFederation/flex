import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

export const useStyles = makeStyles()((_theme) => ({
  licenseScreenLogo: {
    maxWidth: '200px',
  },
  licenseScreenTitle: {
    color: customColors.statusActive,
  },
  licenseCardWrapper: {
    'display': 'flex',
    'justifyContent': 'space-between',
    'gap': '16px',
    '@media screen and (max-width: 680px)': {
      flexWrap: 'wrap',
    },
  },
}))
