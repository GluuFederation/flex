import { makeStyles } from 'tss-react/mui'
import { MOBILE_MEDIA_QUERY, SPACING } from '@/constants'

const MOBILE_DETAIL_COL_MIN = 160
const DESKTOP_MAX_COLUMNS = 5
const TABLET_MAX_COLUMNS = 2

export const DETAIL_LABEL_WIDTH_VAR = '--detail-label-width'

const labelFittedColumns = (maxColumns: number): string => {
  const evenShare = `calc((100% - ${(maxColumns - 1) * SPACING.SECTION_GAP}px) / ${maxColumns})`
  return `repeat(auto-fill, minmax(min(100%, max(var(${DETAIL_LABEL_WIDTH_VAR}, 0px), ${evenShare})), 1fr))`
}

export const useStyles = makeStyles()((theme) => ({
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: labelFittedColumns(DESKTOP_MAX_COLUMNS),
    gap: `${SPACING.SECTION_GAP}px ${SPACING.SECTION_GAP}px`,
    width: '100%',
    minWidth: 0,
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: labelFittedColumns(TABLET_MAX_COLUMNS),
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
  detailLabel: {
    whiteSpace: 'nowrap',
    [`@media ${MOBILE_MEDIA_QUERY}`]: {
      whiteSpace: 'normal',
    },
  },
}))
