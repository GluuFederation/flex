import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
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
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const borderColor = themeColors.borderColor

  return {
    overlay: {
      zIndex: WEBHOOK_MODAL_Z_INDEX,
    },
    modalContainer: {
      ...cardBorderStyle,
      position: 'fixed',
      zIndex: WEBHOOK_MODAL_Z_INDEX + 1,
      backgroundColor: cardBg,
      outline: 'none',
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
      'maxHeight': 300,
      'overflowY': 'auto',
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
  }
})
