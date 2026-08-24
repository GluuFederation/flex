import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'

const REMOVE_BUTTON_SIZE = 32

const REMOVE_BUTTON_PADDING = 6

const useStyles = makeStyles()(() => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.CARD_CONTENT_GAP,
  },
  removeButton: {
    width: REMOVE_BUTTON_SIZE,
    height: REMOVE_BUTTON_SIZE,
    minWidth: REMOVE_BUTTON_SIZE,
    minHeight: REMOVE_BUTTON_SIZE,
    padding: REMOVE_BUTTON_PADDING,
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
}))

export { useStyles }
