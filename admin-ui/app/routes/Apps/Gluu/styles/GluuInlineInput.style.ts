import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'

export const useStyles = makeStyles()(() => ({
  actionButton: {
    marginRight: SPACING.CARD_CONTENT_GAP,
    flexShrink: 0,
  },
}))
