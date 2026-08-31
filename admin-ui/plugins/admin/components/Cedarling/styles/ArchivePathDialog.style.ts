import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights, lineHeights } from '@/styles/fonts'
import { BORDER_RADIUS, CEDARLING_CONFIG_SPACING, MODAL, OPACITY, SPACING } from '@/constants'

type StylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const DIALOG_WIDTH = 640
const INPUT_PADDING_X = 21

const useStyles = makeStyles<StylesParams>()((_theme, { themeColors }) => ({
  modalContainer: {
    '&&': {
      width: `min(${DIALOG_WIDTH}px, ${MODAL.MAX_VW})`,
      maxWidth: `${DIALOG_WIDTH}px`,
    },
  },
  contentArea: {
    '&&': { gap: 0 },
  },
  title: {
    fontFamily,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['3xl'],
    lineHeight: 'normal',
    color: themeColors.fontColor,
    margin: 0,
  },
  field: {
    marginTop: SPACING.SECTION_GAP,
  },
  label: {
    display: 'block',
    marginBottom: CEDARLING_CONFIG_SPACING.LABEL_MB,
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: themeColors.fontColor,
  },
  inputContainer: {
    width: '100%',
    height: CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
    backgroundColor: themeColors.inputBackground,
    border: `1px solid ${themeColors.borderColor}`,
    borderRadius: BORDER_RADIUS.SMALL,
    boxSizing: 'border-box',
  },
  input: {
    'width': '100%',
    'height': '100%',
    'padding': `0 ${INPUT_PADDING_X}px`,
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
    marginTop: CEDARLING_CONFIG_SPACING.HELPER_MT,
    minHeight: fontSizes.md,
  },
  buttonRow: {
    '&&': { marginTop: SPACING.SECTION_GAP },
  },
}))

export { useStyles }
