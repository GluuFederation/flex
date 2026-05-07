import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'

export const useStyles = makeStyles()((theme) => ({
  removeButtonOffset: {
    marginTop: theme.spacing(4),
  },
  actionIcon: {
    marginRight: SPACING.CARD_CONTENT_GAP,
    flexShrink: 0,
  },
}))
