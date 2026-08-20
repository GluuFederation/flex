import { makeStyles } from 'tss-react/mui'

const HELP_ICON_SIZE = 18

const HELP_ICON_GAP = 6
import { MOBILE_MEDIA_QUERY } from '@/constants'

export const useStyles = makeStyles<{ labelColor: string }>()((_, { labelColor }) => ({
  helpIcon: {
    width: HELP_ICON_SIZE,
    height: HELP_ICON_SIZE,
    marginLeft: 0,
    marginRight: HELP_ICON_GAP,
  },
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
