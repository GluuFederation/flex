import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { fontFamily, fontSizes, fontWeights, lineHeights } from '@/styles/fonts'

interface AvailableCustomAttributesPanelStylesParams {
  themeColors: ThemeConfig
  isDark: boolean
}

export const useStyles = makeStyles<AvailableCustomAttributesPanelStylesParams>()((
  _,
  { themeColors, isDark },
) => {
  const panelBg = isDark ? themeColors.inputBackground : themeColors.background
  const innerBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const hoverBg = themeColors.table.rowHoverBg
  const focusOutline = themeColors.availableClaims.focusOutline
  const dividerColor = themeColors.borderColor

  return {
    root: {
      backgroundColor: `${panelBg} !important`,
      border: isDark ? 'none' : `1px solid ${themeColors.borderColor}`,
      borderRadius: BORDER_RADIUS.SMALL,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      minWidth: 0,
      overflow: 'hidden',
      flex: 1,
      width: '100%',
    },
    header: {
      backgroundColor: `${panelBg} !important`,
      padding: '14px 16px',
      color: `${themeColors.fontColor} !important`,
      fontFamily,
      fontSize: fontSizes.content,
      fontStyle: 'normal',
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.loose,
    },
    divider: {
      height: 1,
      width: '100%',
      flexShrink: 0,
      backgroundColor: dividerColor,
    },
    content: {
      'padding': SPACING.CARD_CONTENT_GAP * 2,
      'display': 'flex',
      'flexDirection': 'column',
      'gap': 12,
      'flex': '1 1 auto',
      'minHeight': 0,
      'overflowY': 'auto' as const,
      '& input[type="search"], & input.form-control': {
        backgroundColor: `${innerBg} !important`,
        color: `${themeColors.fontColor} !important`,
      },
    },
    searchWrapper: {
      position: 'relative',
      width: '100%',
      flexShrink: 0,
    },
    search: {
      width: '100%',
      flexShrink: 0,
      borderRadius: BORDER_RADIUS.SMALL,
      border: 'none !important',
      backgroundColor: `${innerBg} !important`,
      color: `${themeColors.fontColor} !important`,
      paddingRight: 36,
      boxSizing: 'border-box',
    },
    searchClearButton: {
      'position': 'absolute',
      'right': 10,
      'top': '50%',
      'transform': 'translateY(-50%)',
      'background': 'transparent',
      'border': 'none',
      'cursor': 'pointer',
      'padding': SPACING.CARD_CONTENT_GAP / 2,
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'color': themeColors.fontColor,
      'fontSize': fontSizes.md,
      '&:hover': {
        opacity: 0.8,
      },
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      alignSelf: 'flex-start',
      width: '100%',
      maxHeight: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      borderRadius: BORDER_RADIUS.SMALL,
      border: 'none',
      backgroundColor: `${innerBg} !important`,
    },
    listItem: {
      borderBottom: 'none',
    },
    emptyState: {
      width: '100%',
      borderRadius: BORDER_RADIUS.SMALL,
      backgroundColor: `${innerBg} !important`,
      padding: '10px 12px',
      boxSizing: 'border-box',
    },
    emptyStateText: {
      display: 'block',
      color: themeColors.textMuted,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
    },
    itemButton: {
      'width': '100%',
      'textAlign': 'left',
      'padding': '10px 12px',
      'background': 'transparent',
      'border': 'none',
      'cursor': 'pointer',
      'color': themeColors.fontColor,
      'fontSize': fontSizes.base,
      'lineHeight': lineHeights.normal,
      '&:hover': {
        backgroundColor: hoverBg,
      },
      '&:focus-visible': {
        outline: `2px solid ${focusOutline}`,
        outlineOffset: -2,
      },
    },
  }
})
