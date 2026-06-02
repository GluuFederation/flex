import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import { CEDARLING_CONFIG_SPACING, MAPPING_SPACING } from '@/constants'

const WEBHOOK_TABLE_MIN_WIDTH = 650
const WEBHOOK_TABLE_VISIBLE_ROWS = 5
const WEBHOOK_TABLE_ROW_HEIGHT = 53
const WEBHOOK_TABLE_MAX_HEIGHT = WEBHOOK_TABLE_ROW_HEIGHT * (WEBHOOK_TABLE_VISIBLE_ROWS + 1)
const CHECKBOX_LABEL_EXTRA_GAP = 3

type StylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((_theme, { themeColors }) => {
  const borderColor = themeColors.borderColor

  return {
    modalContainer: {
      outline: 'none',
    },
    contentArea: {
      gap: 0,
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
      display: 'flex',
      alignItems: 'center',
    },
    titleIcon: {
      marginRight: MAPPING_SPACING.CHECKBOX_LABEL_GAP,
      flexShrink: 0,
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
    tableScrollContainer: {
      marginTop: CEDARLING_CONFIG_SPACING.ALERT_TO_INPUT,
      maxHeight: WEBHOOK_TABLE_MAX_HEIGHT,
      overflowY: 'auto',
      overflowX: 'auto',
      width: '100%',
    },
    tableWrapper: {
      'minWidth': WEBHOOK_TABLE_MIN_WIDTH,
      '& .MuiTableCell-root': {
        borderBottom: `1px solid ${borderColor}`,
        height: WEBHOOK_TABLE_ROW_HEIGHT,
        boxSizing: 'border-box',
      },
    },
    successValue: {
      color: customColors.statusActive,
      fontWeight: fontWeights.semiBold,
    },
    failedValue: {
      color: customColors.accentRed,
      fontWeight: fontWeights.semiBold,
    },
    buttonRow: {
      display: 'flex',
      alignItems: 'center',
      gap: MAPPING_SPACING.CHECKBOX_LABEL_GAP + CHECKBOX_LABEL_EXTRA_GAP,
      marginTop: CEDARLING_CONFIG_SPACING.BUTTONS_MT,
    },
    actionIcon: {
      marginRight: MAPPING_SPACING.CHECKBOX_LABEL_GAP,
      flexShrink: 0,
    },
  }
})
