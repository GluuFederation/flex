import { makeStyles } from 'tss-react/mui'
import type { ClientShowScopesStyleParams } from '../types'

const BODY_MAX_HEIGHT = '50vh'

export const useStyles = makeStyles<ClientShowScopesStyleParams>()(() => {
  return {
    scopesLoaderScope: {
      transform: 'translateZ(0)',
      position: 'relative',
      width: '100%',
      minHeight: 240,
    },
    scopesBody: {
      overflowY: 'auto',
      maxHeight: BODY_MAX_HEIGHT,
      minHeight: 200,
    },
    scopesList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center',
    },
  }
})
