import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material'
import type { ThemeConfig } from '@/context/theme/config'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'
import customColors from '@/customColors'

const statusBadgeBase = {
  display: 'flex' as const,
  padding: '8px',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  gap: '6px',
  borderRadius: 6,
  fontSize: '0.8rem',
  fontWeight: 600,
}

const styles = makeStyles<{ themeColors: ThemeConfig; isDark: boolean }>()(
  (theme: Theme, { themeColors, isDark }) => ({
    mainContainer: {
      padding: theme.spacing(3),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '80vh',
    },
    profileCard: {
      ...getCardBorderStyle({
        isDark,
        borderRadius: 16,
      }),
      maxWidth: 600,
      width: '100%',
      borderRadius: 16,
      backgroundColor: isDark ? customColors.darkCardBg : themeColors.card.background,
      padding: theme.spacing(3.5),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing(3),
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: theme.spacing(0.5),
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: '50%',
      border: `4px solid ${themeColors.card.background}`,
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    statusIndicator: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      width: 14,
      height: 14,
      borderRadius: '50%',
      backgroundColor: themeColors.formFooter.back.backgroundColor,
      border: `2px solid ${themeColors.card.background}`,
    },
    nameText: {
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '24px',
      fontWeight: 600,
      letterSpacing: '0.48px',
      color: themeColors.fontColor,
      marginBottom: theme.spacing(1),
    },
    emailText: {
      color: themeColors.profileEmailTextColor,
      fontFamily,
      fontSize: fontSizes.content,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.content,
      marginBottom: theme.spacing(1),
    },
    profileHeaderStatusWrap: {
      marginTop: 0,
    },
    statusRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 13,
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '28px',
    },
    statusKeyValueWrap: {
      display: 'inline',
      whiteSpace: 'nowrap',
    },
    statusDot: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      flexShrink: 0,
    },
    statusDotActive: {
      backgroundColor: themeColors.formFooter.back.backgroundColor,
    },
    statusDotInactive: {
      backgroundColor: themeColors.settings.removeButton.bg,
    },
    statusLabelActive: {
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '28px',
      color: themeColors.formFooter.back.backgroundColor,
    },
    statusLabelInactive: {
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '28px',
      color: themeColors.settings.removeButton.bg,
    },
    statusValueActive: {
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '28px',
      color: themeColors.formFooter.back.backgroundColor,
    },
    statusValueInactive: {
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '28px',
      color: themeColors.settings.removeButton.bg,
    },
    statusDividerWrapper: {
      width: '100%',
      marginTop: theme.spacing(2),
    },
    statusDivider: {
      margin: 0,
      width: 530,
      minWidth: 530,
      flexShrink: 0,
      borderWidth: '2px 0 0 0',
      borderColor: themeColors.navbar.border,
      opacity: 0.75,
    },
    sectionTitle: {
      color: themeColors.sectionTitleColor,
      fontFamily,
      fontSize: fontSizes.lg,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: '0.4px',
      alignSelf: 'flex-start',
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    dataContainer: {
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: themeColors.lightBackground,
    },
    dataRow: {
      'display': 'flex',
      'justifyContent': 'space-between',
      'alignItems': 'center',
      'padding': theme.spacing(2),
      'borderBottom': `1px solid ${themeColors.borderColor}`,
      '&:last-child': {
        borderBottom: 'none',
      },
    },
    dataRowOdd: {
      backgroundColor: themeColors.settings.formInputBackground,
    },
    dataRowEven: {
      backgroundColor: themeColors.settings.formInputBackground,
    },
    dataLabel: {
      color: themeColors.personalInfoLabelColor,
      fontFamily,
      fontSize: fontSizes.md,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.loose,
    },
    dataValue: {
      color: themeColors.personalInfoValueColor,
      fontFamily,
      fontSize: fontSizes.md,
      fontStyle: 'normal',
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.loose,
    },
    roleContainer: {
      width: '100%',
      padding: theme.spacing(2),
      backgroundColor: themeColors.settings.formInputBackground,
      borderRadius: 8,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    accountStatusContainer: {
      width: '100%',
      padding: theme.spacing(2),
      backgroundColor: themeColors.settings.formInputBackground,
      borderRadius: 8,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    accountStatusPill: {
      borderRadius: 5,
    },
    roleLabel: {
      color: themeColors.personalInfoLabelColor,
      fontFamily,
      fontSize: fontSizes.md,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.loose,
    },
    statusBadge: {
      ...statusBadgeBase,
      backgroundColor: themeColors.formFooter.back.backgroundColor,
      color: themeColors.formFooter.back.textColor,
    },
    statusBadgeInactive: {
      ...statusBadgeBase,
      backgroundColor: themeColors.settings.removeButton.bg,
      color: themeColors.settings.removeButton.text,
    },
    editButton: {
      width: '100%',
      marginTop: 0,
      padding: theme.spacing(1.5),
      backgroundColor: themeColors.formFooter.back.backgroundColor,
      color: themeColors.formFooter.back.textColor,
      fontWeight: 600,
      textTransform: 'none',
      borderRadius: 8,
      fontSize: '1rem',
    },
    editButtonIcon: {
      marginRight: 8,
    },
  }),
)

export default styles
