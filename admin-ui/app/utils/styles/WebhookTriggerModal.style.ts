import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import { CEDARLING_CONFIG_SPACING, MAPPING_SPACING } from '@/constants'
import type { ThemeConfig } from '@/context/theme/config'

const WEBHOOK_MODAL_Z_INDEX = 10050
const WEBHOOK_TABLE_MIN_WIDTH = 650
const CHECKBOX_LABEL_EXTRA_GAP = 3

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useWebhookTriggerModalStyles = makeStyles<StylesParams>()((
  _theme,
  { isDark, themeColors },
) => {
  const blackRgba = hexToRgb(customColors.black)
  const cardBg = isDark ? customColors.darkCardBg : customColors.lightBackground
  const borderColor = themeColors.borderColor

  return {
    overlay: {
      zIndex: WEBHOOK_MODAL_Z_INDEX,
    },
    modalContainer: {
      zIndex: WEBHOOK_MODAL_Z_INDEX + 1,
      backgroundColor: cardBg,
      boxShadow: isDark
        ? `0 25px 50px -12px rgba(${blackRgba}, 0.5), 0 0 0 1px rgba(${blackRgba}, 0.2)`
        : `0 25px 50px -12px rgba(${blackRgba}, 0.25), 0 0 0 1px rgba(${blackRgba}, 0.05)`,
    },
    titleWithDescription: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },
    title: {
      fontFamily,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes['3xl'],
      lineHeight: 'normal',
      color: themeColors.fontColor,
      margin: 0,
      paddingBottom: 0,
    },
    description: {
      fontFamily,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes.base,
      lineHeight: 'normal',
      color: themeColors.fontColor,
      margin: 0,
      paddingTop: MAPPING_SPACING.INFO_ALERT_PADDING_VERTICAL,
    },
    contentArea: {
      gap: 0,
    },
    tableWrapper: {
      'marginTop': CEDARLING_CONFIG_SPACING.ALERT_TO_INPUT,
      'minWidth': WEBHOOK_TABLE_MIN_WIDTH,
      '& .MuiTableCell-root': {
        borderBottom: `1px solid ${borderColor}`,
      },
    },
    buttonRow: {
      display: 'flex',
      alignItems: 'center',
      gap: MAPPING_SPACING.CHECKBOX_LABEL_GAP + CHECKBOX_LABEL_EXTRA_GAP,
      marginTop: CEDARLING_CONFIG_SPACING.BUTTONS_MT,
    },
    loadingOverlay: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: cardBg,
      zIndex: 1,
    },
  }
})
