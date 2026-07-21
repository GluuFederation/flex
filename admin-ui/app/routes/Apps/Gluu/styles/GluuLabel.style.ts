import { makeStyles } from 'tss-react/mui'
import { MOBILE_MEDIA_QUERY } from '@/constants'

export const useStyles = makeStyles<{ labelColor: string }>()((_, { labelColor }) => ({
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: labelColor,
  },
  titleContent: {
    display: 'flex',
    alignItems: 'center',
    [`@media ${MOBILE_MEDIA_QUERY}`]: {
      'display': 'inline',
      '& svg': {
        verticalAlign: 'text-bottom',
      },
    },
  },
}))
