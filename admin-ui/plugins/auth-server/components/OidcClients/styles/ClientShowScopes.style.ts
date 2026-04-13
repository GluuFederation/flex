import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'
import type { ClientShowScopesStyleParams } from '../types'

const BODY_MAX_HEIGHT = '50vh'

export const useStyles = makeStyles<ClientShowScopesStyleParams>()((_, { themeColors }) => {
  return {
    scopesLoaderScope: {
      'transform': 'translateZ(0)',
      'position': 'relative',
      'width': '100%',
      'minHeight': 240,
      '& > div[aria-busy="true"]': {
        position: 'relative',
        minHeight: 240,
      },
      '& > div[aria-busy="true"] > div:last-child': {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'transparent',
        zIndex: 1,
      },
      '& > div[aria-busy="true"] > div:last-child output': {
        filter: `drop-shadow(0 0 1px ${themeColors.card.background})`,
      },
    },
    scopesBody: {
      overflowY: 'auto',
      maxHeight: BODY_MAX_HEIGHT,
      minHeight: 200,
    },
    scopesList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: SPACING.CARD_CONTENT_GAP,
      alignItems: 'center',
    },
  }
})
