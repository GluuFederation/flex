import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

const MODAL_BODY_MAX_HEIGHT = '60vh'

export const useStyles = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor

  return {
    configModalContainer: {
      ...getCardBorderStyle({ isDark }),
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: cardBg,
      minWidth: '45vw',
    },
    modalTitle: {
      borderBottom: `1px solid ${inputBorderColor}`,
    },
    modalBody: {
      overflowX: 'auto' as const,
      overflowY: 'auto' as const,
      maxHeight: MODAL_BODY_MAX_HEIGHT,
      padding: '8px 0 0',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 12,
    },
    modalFooter: {
      display: 'flex',
      gap: 12,
      paddingTop: 16,
      paddingBottom: 8,
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 12,
      margin: '8px 0',
    },
    detailText: {
      color: `${themeColors.fontColor} !important`,
      fontFamily: 'inherit',
    },
    tableWrapper: {
      '& .MuiPaper-root': {
        backgroundColor: `${cardBg} !important`,
        boxShadow: 'none',
      },
      '& .MuiTableCell-root': {
        color: `${themeColors.fontColor} !important`,
        borderBottomColor: `${inputBorderColor} !important`,
        backgroundColor: `${cardBg} !important`,
      },
      '& .MuiTableHead-root .MuiTableCell-root': {
        backgroundColor: `${themeColors.table.headerBg} !important`,
        color: `${themeColors.table.headerColor} !important`,
        fontWeight: 600,
      },
      '& .MuiTableBody-root .MuiTableRow-root:hover td': {
        backgroundColor: `${themeColors.table.rowHoverBg} !important`,
      },
    },
  }
})
