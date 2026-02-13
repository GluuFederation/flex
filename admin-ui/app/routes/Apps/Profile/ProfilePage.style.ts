import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material'
import type { ThemeConfig } from '@/context/theme/config'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

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
        borderRadius: 20,
      }),
      maxWidth: 600,
      width: '100%',
      borderRadius: 20,
      backgroundColor: themeColors.card.background,
      padding: theme.spacing(3.5), // 28px
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing(3),
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: theme.spacing(1),
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
      marginBottom: theme.spacing(0.5),
    },
    emailText: {
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '18px',
      fontWeight: 500,
      letterSpacing: '0.36px',
      color: themeColors.textMuted,
      marginBottom: theme.spacing(1),
    },
    activeStatusText: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(1),
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '28px',
      color: themeColors.formFooter.back.backgroundColor,
    },
    sectionTitle: {
      alignSelf: 'flex-start',
      fontFamily: 'Mona-Sans, sans-serif',
      fontWeight: 500,
      fontSize: '20px',
      letterSpacing: '0.4px',
      color: themeColors.fontColor,
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
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '32px',
      color: themeColors.textMuted,
    },
    dataValue: {
      color: themeColors.fontColor,
      fontWeight: 600,
      fontSize: '0.95rem',
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
    roleLabel: {
      fontFamily: 'Mona-Sans, sans-serif',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '32px',
      color: themeColors.textMuted,
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
