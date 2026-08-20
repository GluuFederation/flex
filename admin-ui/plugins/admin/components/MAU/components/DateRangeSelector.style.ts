import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { BORDER_RADIUS, getSegmentedButtonStyle, SEGMENTED_CONTROL, SPACING } from '@/constants'
import { SHARED_DROPDOWN_STYLES } from '@/components/GluuDropdown/sharedDropdownStyles'

const PRESET_BUTTON_MIN_WIDTH = SEGMENTED_CONTROL.BUTTON_MIN_WIDTH
const VIEW_BUTTON_MIN_WIDTH = 96

const PRESET_MENU_Z_INDEX = SHARED_DROPDOWN_STYLES.menuZIndex
const PRESET_MENU_GAP = SHARED_DROPDOWN_STYLES.margin

export const VIEW_BUTTON_STYLE = {
  minWidth: VIEW_BUTTON_MIN_WIDTH,
  borderRadius: BORDER_RADIUS.SMALL,
  fontFamily,
  fontStyle: 'normal' as const,
  lineHeight: lineHeights.normal,
  letterSpacing: letterSpacing.button,
}

export const getPresetButtonStyle = (isFirst: boolean, isLast: boolean) => {
  const segmented = getSegmentedButtonStyle(isFirst, isLast)

  return { minWidth: PRESET_BUTTON_MIN_WIDTH, ...segmented, marginLeft: 0 }
}

const useStyles = makeStyles()((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column-reverse',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  headingCol: {
    width: '100%',
    marginTop: SPACING.CARD_BUTTON_GAP,
    [theme.breakpoints.up('md')]: {
      width: 'auto',
      marginTop: 0,
    },
  },
  heading: {
    fontFamily,
    fontSize: fontSizes['2xl'],
    fontStyle: 'normal',
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    margin: 0,
  },
  controlsCol: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 'auto',
    },
  },
  controls: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
  secondaryRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: SPACING.CARD_BUTTON_GAP,
    marginTop: SPACING.CARD_BUTTON_GAP,
  },
  presetColWrap: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 'auto',
    },
  },
  presetGroup: {
    'display': 'flex',
    'gap': 0,
    'width': '100%',
    '& > *': {
      flex: 1,
      minWidth: 0,
    },
    '& > * > button': {
      width: '100%',
    },
    '& > * + *': {
      marginLeft: SEGMENTED_CONTROL.BORDER_OVERLAP,
    },
    [theme.breakpoints.up('md')]: {
      'width': 'auto',
      '& > *': {
        flex: 'none',
        minWidth: PRESET_BUTTON_MIN_WIDTH,
      },
    },
  },
  presetSlot: {
    position: 'relative',
  },
  presetMenu: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: PRESET_MENU_Z_INDEX,
    marginTop: PRESET_MENU_GAP,
  },
  datePickerCol: {
    flex: 1,
    minWidth: 0,
    [theme.breakpoints.up('md')]: {
      flex: 'none',
    },
  },
  viewCol: {
    marginLeft: 'auto',
    [theme.breakpoints.up('md')]: {
      marginLeft: 0,
    },
  },
}))

export { useStyles }
