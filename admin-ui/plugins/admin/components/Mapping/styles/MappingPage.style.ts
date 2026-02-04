import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'
import { fontFamily, fontWeights, fontSizes, letterSpacing, lineHeights } from '@/styles/fonts'
import { MAPPING_SPACING } from '@/constants/ui'

interface ThemeColors {
  fontColor: string
  textMuted: string
  card: {
    background: string
    border: string
  }
  infoAlert: {
    background: string
    border: string
    text: string
    icon: string
  }
  checkbox: {
    uncheckedBorder: string
  }
}

interface MappingPageStyleParams {
  isDark: boolean
  theme: ThemeColors
}

export const useStyles = makeStyles<MappingPageStyleParams>()((_theme, { isDark, theme }) => ({
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: MAPPING_SPACING.ALERT_TO_CARD,
  },

  pageDescription: {
    fontFamily,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semiBold,
    lineHeight: 1.5,
    letterSpacing: letterSpacing.normal,
    color: theme.fontColor,
    marginBottom: MAPPING_SPACING.ALERT_TO_CARD,
  },

  infoAlert: {
    backgroundColor: theme.infoAlert.background,
    border: `1px solid ${theme.infoAlert.border}`,
    borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
    padding: `${MAPPING_SPACING.INFO_ALERT_PADDING_VERTICAL}px ${MAPPING_SPACING.INFO_ALERT_PADDING_HORIZONTAL}px`,
    display: 'flex',
    alignItems: 'center',
    gap: MAPPING_SPACING.INFO_ALERT_GAP,
  },

  infoIcon: {
    width: MAPPING_SPACING.INFO_ICON_SIZE,
    height: MAPPING_SPACING.INFO_ICON_SIZE,
    color: theme.infoAlert.icon,
    flexShrink: 0,
  },

  infoText: {
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    color: theme.infoAlert.text,
  },

  infoLink: {
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: theme.fontColor,
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },

  roleCard: {
    backgroundColor: theme.card.background,
    borderRadius: MAPPING_SPACING.CARD_BORDER_RADIUS,
    boxShadow: `0px 4px 11px 0px rgba(${hexToRgb(customColors.black)}, 0.05)`,
    marginBottom: MAPPING_SPACING.CARD_MARGIN_BOTTOM,
    overflow: 'hidden',
  },

  roleCardHeader: {
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'space-between',
    'padding': `0 ${MAPPING_SPACING.CARD_PADDING}px`,
    'height': MAPPING_SPACING.CARD_HEADER_HEIGHT,
    'borderBottom': `1px solid ${theme.card.border}`,
    'cursor': 'pointer',
    'transition': 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: isDark
        ? `rgba(${hexToRgb(customColors.white)}, 0.02)`
        : `rgba(${hexToRgb(customColors.black)}, 0.02)`,
    },
  },

  roleTitle: {
    fontFamily,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    color: theme.fontColor,
  },

  roleHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },

  permissionCount: {
    fontFamily,
    fontSize: '15px',
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.relaxed,
    color: theme.fontColor,
  },

  permissionCountHighlight: {
    color: customColors.statusActive,
  },

  chevronIcon: {
    width: 18,
    height: 18,
    color: theme.fontColor,
    transition: 'transform 0.3s ease',
  },

  chevronIconOpen: {
    transform: 'rotate(180deg)',
  },

  roleCardContent: {
    padding: MAPPING_SPACING.CARD_PADDING,
    paddingTop: MAPPING_SPACING.CONTENT_PADDING_TOP,
  },

  permissionsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${MAPPING_SPACING.PERMISSION_ROW_GAP}px ${MAPPING_SPACING.PERMISSION_ITEM_GAP}px`,
    alignItems: 'center',
  },

  permissionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: MAPPING_SPACING.CHECKBOX_LABEL_GAP,
    cursor: 'default',
  },

  checkbox: {
    width: MAPPING_SPACING.CHECKBOX_SIZE,
    height: MAPPING_SPACING.CHECKBOX_SIZE,
    borderRadius: MAPPING_SPACING.CHECKBOX_BORDER_RADIUS,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: isDark ? 'transparent' : customColors.white,
    border: `${MAPPING_SPACING.CHECKBOX_BORDER_WIDTH}px solid ${customColors.statusActive}`,
  },

  checkboxUnchecked: {
    backgroundColor: isDark ? 'transparent' : customColors.white,
    border: `${MAPPING_SPACING.CHECKBOX_BORDER_WIDTH}px solid ${theme.checkbox.uncheckedBorder}`,
  },

  checkIcon: {
    width: MAPPING_SPACING.CHECK_ICON_SIZE,
    height: MAPPING_SPACING.CHECK_ICON_SIZE,
    color: customColors.statusActive,
  },

  permissionLabel: {
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: 'normal',
    color: isDark ? customColors.white : customColors.black,
  },

  noPermissions: {
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: theme.textMuted,
    fontStyle: 'italic',
  },

  errorAlert: {
    marginBottom: MAPPING_SPACING.CARD_MARGIN_BOTTOM,
  },
}))
