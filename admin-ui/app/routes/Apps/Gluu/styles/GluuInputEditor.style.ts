import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

export const useStyles = makeStyles()(() => ({
  colWrapper: {
    position: 'relative',
  },
  error: {
    color: customColors.accentRed,
    margin: '1px 2px',
  },
}))
