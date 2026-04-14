import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'

type ClientActiveTokensStyleParams = {
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<ClientActiveTokensStyleParams>()(() => ({
  filterToolbar: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: SPACING.CARD_PADDING,
    width: 500,
  },
  exportButton: {
    marginLeft: SPACING.CARD_CONTENT_GAP * 2,
  },
  filterPanel: {
    padding: SPACING.CARD_PADDING,
    marginTop: SPACING.CARD_CONTENT_GAP * 2,
    borderRadius: BORDER_RADIUS.SMALL,
    position: 'absolute',
    top: '50%',
    zIndex: 2,
    backgroundColor: customColors.white,
    width: 500,
    border: `1px solid ${customColors.lightGray}`,
  },
}))
