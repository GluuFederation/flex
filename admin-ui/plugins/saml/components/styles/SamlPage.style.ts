import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'

export const useStyles = makeStyles()(() => ({
  pageCard: {
    marginBottom: SPACING.CARD_GAP,
  },
  form: {
    marginTop: SPACING.PAGE,
  },
}))
