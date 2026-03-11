import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'
import { BORDER_RADIUS } from '@/constants'
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
  const paginationAccentColor = customColors.claimsSelectionBorder
  const tableBorderColor = themeColors.borderColor
  const tableBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  /* Same border as dashboard, health, license, asset, webhook */
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
    /* Row 1 = X top-right, Row 2 = heading left-aligned */
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
      'display': 'flex',
      'justifyContent': 'flex-end',
      'alignItems': 'center',
      'padding': '16px 16px 0 0',
      '& .btn-close': {
        margin: 0,
        padding: '0.5rem',
        color: isDark ? `${customColors.white} !important` : `${themeColors.fontColor} !important`,
        opacity: 1,
        ...(isDark && { filter: 'brightness(0) invert(1)' }),
      },
      '& .btn-close:hover': {
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
      /* Figma: padding around table - 24px all sides */
      padding: 24,
      borderRadius: `0 0 ${BORDER_RADIUS.DEFAULT}px ${BORDER_RADIUS.DEFAULT}px`,
    },
    tableWrapper: {
      /* Allow horizontal scroll when table content is wide */
      '& > div, & > div > div:last-child': {
        overflowX: 'auto',
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
        color: `${paginationAccentColor} !important`,
      },
      '& [class*="paginationSelectIcon"]': {
        color: `${paginationAccentColor} !important`,
      },
    },
  }
})
