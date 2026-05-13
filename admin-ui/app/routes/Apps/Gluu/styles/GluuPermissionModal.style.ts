import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

export const useStyles = makeStyles()((theme) => ({
  modalBody: {
    textAlign: 'center',
  },
  mutedText: {
    color: customColors.textSecondary,
    marginBottom: theme.spacing(2),
  },
}))
