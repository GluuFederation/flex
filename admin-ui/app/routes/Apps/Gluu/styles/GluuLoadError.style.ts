import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
  message: {
    color: customColors.accentRed,
  },
}))
