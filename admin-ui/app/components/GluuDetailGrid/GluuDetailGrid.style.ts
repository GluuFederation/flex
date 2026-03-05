import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'

/** Min width per cell for ~5 columns on desktop; prevents label/value overlap */
const MIN_CELL_WIDTH = 160

export const useStyles = makeStyles()(() => ({
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${MIN_CELL_WIDTH}px, 1fr))`,
    gap: `${SPACING.SECTION_GAP}px ${SPACING.SECTION_GAP}px`,
    width: '100%',
    minWidth: 0,
  },
  detailItem: {
    minWidth: 0,
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
}))
