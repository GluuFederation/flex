import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'

export const useStyles = makeStyles()(() => ({
  accordionSpacing: {
    marginBottom: SPACING.CARD_CONTENT_GAP,
  },
  headerRow: {
    display: 'flex',
  },
  addButtonIcon: {
    marginRight: SPACING.CARD_CONTENT_GAP,
  },
}))
