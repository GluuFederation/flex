import { makeStyles } from 'tss-react/mui'
import { BORDER_RADIUS, SPACING } from '@/constants'
import type { ThemeConfig } from '@/context/theme/config'

type UserClaimEntryStyleParams = {
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<UserClaimEntryStyleParams>()((_, { themeColors }) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const borderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor

  return {
    claimRow: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
    },
    claimCard: {
      flex: 1,
      minWidth: 0,
      backgroundColor: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: SPACING.CARD_CONTENT_GAP * 2,
      boxSizing: 'border-box' as const,
    },
    removeButton: {
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': 32,
      'height': 32,
      'minWidth': 32,
      'padding': 6,
      'flexShrink': 0,
      'background': 'transparent',
      'border': 'none',
      'boxShadow': 'none',
      'cursor': 'pointer',
      'color': themeColors.fontColor,
      '& .MuiSvgIcon-root': {
        fontSize: 16,
        color: themeColors.fontColor,
      },
    },
  }
})
