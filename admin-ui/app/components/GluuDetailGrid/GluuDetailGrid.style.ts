import { makeStyles } from 'tss-react/mui'
import { MOBILE_MEDIA_QUERY, SPACING } from '@/constants'

const MOBILE_DETAIL_COL_MIN = 160
const MAX_PER_ROW = 5

export const DETAIL_LABEL_WIDTH_VAR = '--detail-label-width'

const EVEN_SHARE = `calc((100% - ${(MAX_PER_ROW - 1) * SPACING.SECTION_GAP}px) / ${MAX_PER_ROW})`
const ITEM_BASIS = `min(100%, max(var(${DETAIL_LABEL_WIDTH_VAR}, 0px), ${EVEN_SHARE}))`

const itemBase = {
  minWidth: 0,
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
} as const

export const useStyles = makeStyles()(() => ({
  detailGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${SPACING.SECTION_GAP}px ${SPACING.SECTION_GAP}px`,
    width: '100%',
    minWidth: 0,
  },
  detailItem: {
    ...itemBase,
    flex: `1 1 ${ITEM_BASIS}`,
    [`@media ${MOBILE_MEDIA_QUERY}`]: {
      flex: `1 1 ${MOBILE_DETAIL_COL_MIN}px`,
    },
  },
  detailItemFullWidth: {
    ...itemBase,
    flex: '1 1 100%',
  },
  detailLabel: {
    whiteSpace: 'nowrap',
    [`@media ${MOBILE_MEDIA_QUERY}`]: {
      whiteSpace: 'normal',
    },
  },
}))
