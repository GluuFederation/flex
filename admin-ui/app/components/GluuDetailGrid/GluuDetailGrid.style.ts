import { makeStyles } from 'tss-react/mui'
import { MOBILE_MEDIA_QUERY, SPACING } from '@/constants'

const MOBILE_DETAIL_COL_MIN = 160

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
    [`@media ${MOBILE_MEDIA_QUERY}`]: {
      gridTemplateColumns: `repeat(auto-fit, minmax(${MOBILE_DETAIL_COL_MIN}px, 1fr))`,
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
