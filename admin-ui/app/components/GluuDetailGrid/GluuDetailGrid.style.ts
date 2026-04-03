import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'

export const useStyles = makeStyles()((theme) => ({
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: `${SPACING.SECTION_GAP}px ${SPACING.SECTION_GAP}px`,
    width: '100%',
    minWidth: 0,
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  detailItem: {
    minWidth: 0,
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  detailItemFullWidth: {
    gridColumn: '1 / -1',
    minWidth: 0,
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
}))
