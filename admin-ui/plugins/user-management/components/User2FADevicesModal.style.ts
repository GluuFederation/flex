import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'
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
  const modalBg = isDark
    ? (themeColors.settings?.cardBackground ?? themeColors.card.background)
    : customColors.white
  const borderColor = themeColors.borderColor
  const accentGreen = customColors.claimsSelectionBorder
  const tableBorderColor = '#193F66'
  const tableBg = '#091E34'
  /* Same border as dashboard, health, license, asset, webhook */
  const modalCardBorderStyle = getCardBorderStyle({
    isDark,
    borderRadius: 12,
  })

  return {
    modal2FA: {
      '& .modal-content': {
        ...modalCardBorderStyle,
        borderRadius: 12,
        backgroundColor: modalBg,
        overflow: 'visible',
      },
    },
    /* Row 1 = X top-right, Row 2 = heading left-aligned */
    modalHeader: {
      display: 'flex !important',
      flexDirection: 'column !important' as 'column',
      alignItems: 'stretch !important',
      backgroundColor: modalBg,
      borderBottom: `1px solid ${borderColor}`,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      padding: '0 !important',
    },
    headerTopRow: {
      'display': 'flex',
      'justifyContent': 'flex-end',
      'alignItems': 'center',
      'padding': '16px 16px 0 0',
      '& .btn-close': {
        margin: 0,
        padding: '0.5rem',
        color: `${customColors.white} !important`,
        opacity: 1,
        filter: 'brightness(0) invert(1)',
      },
      '& .btn-close:hover': {
        opacity: 0.8,
      },
    },
    modalTitle: {
      color: '#FFF',
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
      /* Figma: padding around table - 24px all sides */
      padding: 24,
      borderRadius: '0 0 12px 12px',
    },
    tableWrapper: {
      /* Prevent horizontal scroll - table fits within modal */
      '& > div, & > div > div:last-child': {
        overflowX: 'visible',
      },
      /* Override GluuTable wrapper - table styles */
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
        color: `${accentGreen} !important`,
      },
      '& [class*="paginationSelectIcon"]': {
        color: `${accentGreen} !important`,
      },
    },
  }
})
