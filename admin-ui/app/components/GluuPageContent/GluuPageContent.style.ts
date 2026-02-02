import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'

interface GluuPageContentStyleParams {
  withVerticalPadding: boolean
  maxWidth?: number
  background: string
}

export const useStyles = makeStyles<GluuPageContentStyleParams>()(
  (_, { withVerticalPadding, maxWidth, background }) => ({
    root: {
      maxWidth: '100vw',
      width: '100%',
      padding: withVerticalPadding ? `${SPACING.PAGE}px` : `0 ${SPACING.PAGE}px`,
      boxSizing: 'border-box',
      backgroundColor: background,
    },
    wrapper: {
      width: '100%',
      maxWidth: maxWidth ?? '100%',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  }),
)
