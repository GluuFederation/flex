import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

export const useStyles = makeStyles()(() => ({
  container: {
    backgroundColor: customColors.whiteSmoke,
    minWidth: '100%',
  },
}))
