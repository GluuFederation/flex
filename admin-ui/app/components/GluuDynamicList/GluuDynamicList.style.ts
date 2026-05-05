import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { ICON_SIZE } from '@/constants'
import type { ThemeConfig } from '@/context/theme/config'
import { getDynamicListStyles } from '@/styles/dynamicListStyles'
import { fontSizes, fontWeights, lineHeights, letterSpacing, fontFamily } from '@/styles/fonts'

type GluuDynamicListStyleParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<GluuDynamicListStyleParams>()((
  _theme,
  { isDark, themeColors },
) => {
  const borderColor = isDark ? customColors.darkBorder : customColors.borderInput
  const dl = getDynamicListStyles({
    boxBg: themeColors.settings.formInputBackground,
    inputBg: themeColors.settings.cardBackground,
    borderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
    errorColor: themeColors.errorColor,
  })

  return {
    wrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 4,
      width: '100%',
    },
    outerLabel: {
      color: `${themeColors.fontColor} !important`,
      fontSize: `${fontSizes.base} !important`,
      fontWeight: `${fontWeights.semiBold} !important`,
      lineHeight: `${lineHeights.normal} !important`,
      letterSpacing: `${letterSpacing.normal} !important`,
      margin: '0 !important',
    },
    box: dl.listBox,
    boxEmpty: dl.listBoxEmpty,
    header: dl.listHeader,
    headerEmpty: dl.listHeaderEmpty,
    title: dl.listTitle,
    body: dl.listBody,
    row: dl.listRow,
    singleRow: {
      ...dl.listRow,
      'flexWrap': 'nowrap',
      'alignItems': 'flex-start',
      '@media (max-width: 768px)': {
        flexWrap: 'wrap',
      },
    },
    input: dl.listInput,
    singleInput: {
      'flex': '1 1 auto',
      'width': 'auto',
      'minWidth': 0,
      '@media (max-width: 768px)': {
        flex: '1 1 100%',
        width: '100%',
      },
    },
    inputWrapper: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
      flex: '1 1 auto',
      minWidth: 0,
      gap: 4,
    },
    itemError: {
      ...dl.listError,
      fontSize: '12px',
      marginTop: 0,
    },
    actionBtn: {
      ...dl.listActionBtn,
      '&& i.fa-trash': {
        color: `${themeColors.settings.removeButton.text} !important`,
      },
    },
    actionBtnIcon: {
      fontSize: ICON_SIZE.SM,
      marginRight: 4,
      flexShrink: 0,
    },
    addBtn: {
      'position': 'relative' as const,
      'display': 'flex' as const,
      'alignItems': 'center' as const,
      'justifyContent': 'center' as const,
      'minWidth': 156,
      'height': 44,
      'padding': '0 36px',
      fontFamily,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.semiBold,
      'lineHeight': 1.4,
      'color': `${themeColors.settings.addPropertyButton.text} !important`,
      'backgroundColor': themeColors.settings.addPropertyButton.bg,
      'border': 'none' as const,
      'borderRadius': 6,
      'cursor': 'pointer' as const,
      'flexShrink': 0,
      'whiteSpace': 'nowrap' as const,
      'transition': 'opacity 0.15s ease-in-out',
      '&:disabled': {
        opacity: 0.4,
        cursor: 'not-allowed' as const,
      },
      '&:hover:not(:disabled)': {
        opacity: 0.85,
      },
      '&:focus, &:focus-visible, &:active': {
        outline: 'none !important',
        boxShadow: 'none !important',
      },
    },
    addBtnIcon: {
      position: 'absolute' as const,
      left: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: ICON_SIZE.SM,
      pointerEvents: 'none' as const,
    },
    error: dl.listError,
  }
})
