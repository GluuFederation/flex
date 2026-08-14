import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { BORDER_RADIUS, getSegmentedButtonStyle, SEGMENTED_CONTROL, SPACING } from '@/constants'

const PRESET_BUTTON_MIN_WIDTH = SEGMENTED_CONTROL.BUTTON_MIN_WIDTH
const VIEW_BUTTON_MIN_WIDTH = 96

export const VIEW_BUTTON_STYLE = {
  minWidth: VIEW_BUTTON_MIN_WIDTH,
  borderRadius: BORDER_RADIUS.SMALL_MEDIUM,
  fontFamily,
  fontStyle: 'normal' as const,
  lineHeight: lineHeights.normal,
  letterSpacing: letterSpacing.button,
}

export const getPresetButtonStyle = (isFirst: boolean, isLast: boolean) => ({
  minWidth: PRESET_BUTTON_MIN_WIDTH,
  ...getSegmentedButtonStyle(isFirst, isLast),
})

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
    '& > button': {
      flex: 1,
      minWidth: 0,
    },
    [theme.breakpoints.up('md')]: {
      'width': 'auto',
      '& > button': {
        flex: 'none',
        minWidth: PRESET_BUTTON_MIN_WIDTH,
      },
    },
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
