import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

export const useStyles = makeStyles()(() => ({
  helperText: {
    fontSize: 12,
  },
  error: {
    color: customColors.accentRed,
  },
}))
