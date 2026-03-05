import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'

import customColors from '@/customColors'

interface AvailableClaimsPanelStylesParams {
  themeColors: ThemeConfig
  isDark: boolean
}

export const useStyles = makeStyles<AvailableClaimsPanelStylesParams>()((
  _,
  { themeColors, isDark },
) => {
  const claimsBg = isDark
    ? '#15395D'
    : (themeColors.settings?.cardBackground ?? themeColors.card.background)
  const claimsInnerBg = isDark ? '#091E34' : themeColors.background
  const selectionBg = customColors.claimsSelectionBg

  return {
    root: {
      backgroundColor: `${claimsBg} !important`,
      border: 'none',
      borderRadius: 6,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      overflow: 'hidden',
      flex: 1,
    },
    header: {
      backgroundColor: `${claimsBg} !important`,
      padding: '14px 16px',
      fontWeight: 600,
      color: `${themeColors.fontColor} !important`,
    },
    content: {
      'padding': 16,
      'display': 'flex',
      'flexDirection': 'column',
      'gap': 12,
      'minHeight': 0,
      'flex': 1,
      'overflow': 'hidden',
      '& input[type="search"], & input.form-control': {
        backgroundColor: `${claimsInnerBg} !important`,
        color: `${themeColors.fontColor} !important`,
      },
    },
    search: {
      width: '100%',
      borderRadius: 6,
      border: 'none !important',
      backgroundColor: `${claimsInnerBg} !important`,
      color: `${themeColors.fontColor} !important`,
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      flex: 1,
      overflow: 'auto',
      borderRadius: 6,
      border: 'none',
      backgroundColor: `${claimsInnerBg} !important`,
    },
    listItem: {
      borderBottom: 'none',
    },
    itemButton: {
      'width': '100%',
      'textAlign': 'left',
      'padding': '10px 12px',
      'background': 'transparent',
      'border': 'none',
      'cursor': 'pointer',
      'color': themeColors.fontColor,
      'fontSize': 14,
      'lineHeight': '20px',
      '&:hover': {
        backgroundColor: selectionBg,
        color: customColors.statusActive,
      },
      '&:focus-visible': {
        outline: `2px solid ${customColors.lightBlue}`,
        outlineOffset: -2,
      },
    },
  }
})
