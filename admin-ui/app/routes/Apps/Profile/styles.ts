import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontWeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { BORDER_RADIUS } from '@/constants'
import getThemeColor from '@/context/theme/config'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'
import customColors from '@/customColors'

interface ProfileStyleParams {
  isDark: boolean
}

// Exact measurements from Figma design
const CARD_WIDTH = 583
const CARD_HORIZONTAL_PADDING = 42
const CARD_TOP_PADDING = 46
const CARD_BOTTOM_PADDING = 40
const INFO_ROW_HEIGHT = 54
const ROLE_STATUS_BOX_HEIGHT = 58
const BOX_INNER_PADDING = 30
const INFO_ROW_BORDER_WIDTH = 1.5

const styles = makeStyles<ProfileStyleParams>()((_theme, { isDark }) => {
  const themeColors = getThemeColor(isDark ? THEME_DARK : THEME_LIGHT)
  const cardBorderStyle = getCardBorderStyle({
    isDark,
    borderRadius: BORDER_RADIUS.DEFAULT,
  })

  return {
    pageWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: 51,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 20,
    },

    profileCard: {
      width: CARD_WIDTH,
      maxWidth: '100%',
      backgroundColor: themeColors.card.background,
      borderRadius: 16,
      paddingTop: CARD_TOP_PADDING,
      paddingBottom: CARD_BOTTOM_PADDING,
      paddingLeft: CARD_HORIZONTAL_PADDING,
      paddingRight: CARD_HORIZONTAL_PADDING,
      ...cardBorderStyle,
    },

    avatarWrapper: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 22,
    },

    avatar: {
      width: 54,
      height: 54,
      borderRadius: '50%',
      objectFit: 'cover' as const,
    },

    displayName: {
      fontFamily,
      fontSize: 24,
      fontWeight: fontWeights.semiBold,
      letterSpacing: '0.48px',
      color: themeColors.fontColor,
      textAlign: 'center' as const,
      marginBottom: 8,
    },

    email: {
      fontFamily,
      fontSize: 18,
      fontWeight: fontWeights.medium,
      letterSpacing: '0.36px',
      color: themeColors.textMuted,
      textAlign: 'center' as const,
      marginBottom: 19,
    },

    statusRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 13,
      marginBottom: 29,
    },

    statusDot: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      backgroundColor: customColors.statusActive,
      flexShrink: 0,
    },

    statusText: {
      fontFamily,
      fontSize: 16,
      fontWeight: fontWeights.semiBold,
      lineHeight: '28px',
      color: customColors.statusActive,
    },

    divider: {
      width: '100%',
      height: 1,
      backgroundColor: themeColors.borderColor,
      marginBottom: 33,
    },

    sectionTitle: {
      fontFamily,
      fontSize: 20,
      fontWeight: fontWeights.medium,
      letterSpacing: '0.4px',
      color: themeColors.fontColor,
      marginBottom: 18,
    },

    infoBox: {
      backgroundColor: themeColors.inputBackground,
      borderRadius: 6,
      marginBottom: 30,
      overflow: 'hidden',
    },

    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: INFO_ROW_HEIGHT,
      paddingLeft: BOX_INNER_PADDING,
      paddingRight: BOX_INNER_PADDING,
      borderBottom: `${INFO_ROW_BORDER_WIDTH}px solid ${themeColors.borderColor}`,
    },

    infoRowLast: {
      borderBottom: 'none',
    },

    infoLabel: {
      fontFamily,
      fontSize: 16,
      fontWeight: fontWeights.medium,
      lineHeight: '32px',
      color: themeColors.fontColor,
    },

    infoValue: {
      fontFamily,
      fontSize: 16,
      fontWeight: fontWeights.bold,
      lineHeight: '32px',
      color: themeColors.fontColor,
      textAlign: 'right' as const,
    },

    roleBox: {
      backgroundColor: themeColors.inputBackground,
      borderRadius: 6,
      height: ROLE_STATUS_BOX_HEIGHT,
      paddingLeft: BOX_INNER_PADDING,
      paddingRight: BOX_INNER_PADDING,
      marginBottom: 30,
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
    },

    roleLabel: {
      fontFamily,
      fontSize: 16,
      fontWeight: fontWeights.medium,
      lineHeight: '32px',
      color: themeColors.fontColor,
      flexShrink: 0,
    },

    roleBadge: {
      fontFamily,
      fontSize: 12,
      fontWeight: fontWeights.medium,
      lineHeight: '24px',
      letterSpacing: '0.2px',
      color: customColors.white,
      backgroundColor: customColors.statusActive,
      borderRadius: 5,
      padding: '6px 12px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },

    statusBox: {
      backgroundColor: themeColors.inputBackground,
      borderRadius: 6,
      height: ROLE_STATUS_BOX_HEIGHT,
      paddingLeft: BOX_INNER_PADDING,
      paddingRight: BOX_INNER_PADDING,
      marginBottom: 25,
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
    },

    statusLabel: {
      fontFamily,
      fontSize: 16,
      fontWeight: fontWeights.medium,
      lineHeight: '32px',
      color: themeColors.fontColor,
      flexShrink: 0,
    },

    statusBadge: {
      fontFamily,
      fontSize: 12,
      fontWeight: fontWeights.medium,
      lineHeight: '24px',
      letterSpacing: '0.2px',
      color: customColors.statusActive,
      backgroundColor: customColors.statusActiveBg,
      borderRadius: 5,
      padding: '6px 12px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },

    editButton: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'gap': 4,
      'height': 40,
      'backgroundColor': customColors.statusActive,
      'color': customColors.white,
      'borderRadius': 6,
      'border': 'none',
      'paddingLeft': 28,
      'paddingRight': 28,
      'cursor': 'pointer',
      fontFamily,
      'fontSize': 14,
      'fontWeight': fontWeights.bold,
      'letterSpacing': '0.28px',
      '&:hover': {
        opacity: 0.9,
      },
    },

    editIcon: {
      width: 22,
      height: 22,
    },
  }
})

export default styles
