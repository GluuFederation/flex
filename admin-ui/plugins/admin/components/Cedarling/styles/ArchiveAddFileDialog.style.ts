import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights, lineHeights } from '@/styles/fonts'
import { BORDER_RADIUS, CEDARLING_CONFIG_SPACING, MODAL, OPACITY } from '@/constants'

type StylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const DIALOG_WIDTH = 640
const INPUT_HEIGHT = 48

const HALF_GAP = Math.round((CEDARLING_CONFIG_SPACING.BUTTONS_MT + 5) / 2)

const useStyles = makeStyles<StylesParams>()((_theme, { themeColors }) => ({
  modalContainer: {
    '&&': {
      width: `min(${DIALOG_WIDTH}px, ${MODAL.MAX_VW})`,
      maxWidth: `${DIALOG_WIDTH}px`,
    },
  },
  title: {
    fontFamily,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['3xl'],
    lineHeight: 'normal',
    color: themeColors.fontColor,
    margin: 0,
  },
  inputContainer: {
    width: '100%',
    height: INPUT_HEIGHT,
    marginTop: HALF_GAP,
    backgroundColor: themeColors.inputBackground,
    border: `1px solid ${themeColors.borderColor}`,
    borderRadius: BORDER_RADIUS.SMALL,
    boxSizing: 'border-box',
  },
  input: {
    'width': '100%',
    'height': '100%',
    'padding': '0 21px',
    'backgroundColor': 'transparent',
    'border': 'none',
    'borderRadius': BORDER_RADIUS.SMALL,
    fontFamily,
    'fontSize': fontSizes.base,
    'fontWeight': fontWeights.medium,
    'lineHeight': lineHeights.relaxed,
    'color': themeColors.fontColor,
    'outline': 'none',
    'boxSizing': 'border-box',
    '&::placeholder': {
      color: themeColors.textMuted,
      opacity: OPACITY.FULL,
    },
  },
  errorMessage: {
    fontFamily,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.relaxed,
    color: themeColors.errorColor,
    margin: 0,
    marginTop: 6,
    minHeight: fontSizes.base,
  },
  buttonRow: {
    marginTop: HALF_GAP,
  },
}))

export { useStyles }
