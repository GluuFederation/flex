import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { SPACING } from '@/constants'

export const useStyles = makeStyles()((theme) => ({
  inputContainer: {
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: customColors.logo,
  },
  spacer: {
    height: theme.spacing(1),
  },
  actionIcon: {
    marginRight: SPACING.CARD_CONTENT_GAP,
    flexShrink: 0,
  },
}))
