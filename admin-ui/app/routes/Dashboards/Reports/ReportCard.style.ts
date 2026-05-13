import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

export const useStyles = makeStyles()((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
    borderRadius: '10px',
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  valueRow: {
    marginBottom: theme.spacing(3),
  },
  trendIcon: {
    color: customColors.statusActive,
  },
}))
