import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'
import { BORDER_RADIUS, ICON_SIZE } from '@/constants'
import { fontFamily } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

interface User2FADevicesModalStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<User2FADevicesModalStylesParams>()((
  _,
  { isDark, themeColors },
) => {
  const modalBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const borderColor = themeColors.borderColor
  const paginationAccentColor = customColors.claimsSelectionBorder
  const tableBorderColor = themeColors.borderColor
  const tableBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const modalCardBorderStyle = getCardBorderStyle({
    isDark,
    borderRadius: BORDER_RADIUS.DEFAULT,
  })

  return {
    modal2FA: {
      '& .modal-content': {
        ...modalCardBorderStyle,
        borderRadius: BORDER_RADIUS.DEFAULT,
        backgroundColor: modalBg,
        overflow: 'visible',
      },
    },
    modalHeader: {
      display: 'flex !important',
      flexDirection: 'column !important' as 'column',
      alignItems: 'stretch !important',
      backgroundColor: modalBg,
      borderBottom: `1px solid ${borderColor}`,
      borderTopLeftRadius: BORDER_RADIUS.DEFAULT,
      borderTopRightRadius: BORDER_RADIUS.DEFAULT,
      padding: '0 !important',
    },
    headerTopRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '16px 16px 0 0',
    },
    closeButton: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'margin': 0,
      'padding': '0.5rem',
      'border': 0,
      'background': 'transparent',
      'color': themeColors.fontColor,
      'cursor': 'pointer',
      'opacity': 1,
      '&:hover': {
        opacity: 0.8,
      },
    },
    modalTitle: {
      color: themeColors.fontColor,
      fontFamily,
      fontSize: 36,
      fontWeight: 700,
      lineHeight: '45px',
      margin: 0,
      padding: '8px 32px 24px 32px',
      textAlign: 'left' as const,
    },
    modalContent: {
      backgroundColor: modalBg,
      color: themeColors.fontColor,
      padding: 24,
      borderRadius: `0 0 ${BORDER_RADIUS.DEFAULT}px ${BORDER_RADIUS.DEFAULT}px`,
    },
    tableWrapper: {
      '& > div, & > div > div:last-child': {
        overflowX: 'auto',
      },
      '& > div > div:last-child': {
        borderRadius: 10,
        border: `1px solid ${tableBorderColor}`,
        backgroundColor: tableBg,
      },
      '& table': {
        minWidth: 0,
        tableLayout: 'auto',
      },
      '& thead tr': {
        backgroundColor: tableBg,
      },
      '& thead th': {
        color: themeColors.table.headerColor,
        borderBottomColor: tableBorderColor,
      },
      '& tbody tr': {
        backgroundColor: tableBg,
      },
      '& tbody td': {
        color: themeColors.fontColor,
      },
      '& [data-divider-cell]': {
        borderBottomColor: tableBorderColor,
      },
      '& [class*="paginationBar"]': {
        backgroundColor: tableBg,
        borderTopColor: tableBorderColor,
      },
      '& [class*="paginationButton"]:not([disabled])': {
        color: `${paginationAccentColor} !important`,
      },
      '& [class*="paginationSelectIcon"]': {
        color: `${paginationAccentColor} !important`,
      },
    },
    actionIcon: {
      fontSize: ICON_SIZE.SM,
    },
  }
})
