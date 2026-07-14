import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontSizes, fontWeights, lineHeights } from '@/styles/fonts'
import { BORDER_RADIUS } from '@/constants'

const useStyles = makeStyles()(() => ({
  tooltip: {
    borderRadius: BORDER_RADIUS.SMALL_MEDIUM,
    padding: '12px 16px',
    minWidth: '200px',
  },
  item: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
  },
  itemSpaced: {
    marginBottom: '8px',
  },
  itemLabel: {
    fontWeight: fontWeights.semiBold,
  },
}))

export { useStyles }
