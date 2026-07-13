import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { ICON_SIZE, OPACITY, SMALL_MAX_MEDIA_QUERY } from '@/constants'
import type { ThemeConfig } from '@/context/theme/config'
import { getDynamicListStyles } from '@/styles/dynamicListStyles'
import { fontSizes, fontWeights, lineHeights, letterSpacing, fontFamily } from '@/styles/fonts'

// Below this width the pair rows stack (title/inputs/buttons full-width); at or
// above it the desktop row layout is kept.
const STACK_QUERY = `@media ${SMALL_MAX_MEDIA_QUERY}`

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
    header: {
      ...dl.listHeader,
      [STACK_QUERY]: {
        flexDirection: 'column' as const,
        alignItems: 'stretch' as const,
      },
    },
    headerEmpty: dl.listHeaderEmpty,
    title: dl.listTitle,
    body: dl.listBody,
    row: {
      ...dl.listRow,
      [STACK_QUERY]: {
        flexDirection: 'column' as const,
        alignItems: 'stretch' as const,
        flexWrap: 'nowrap' as const,
      },
    },
    singleRow: {
      ...dl.listRow,
      'flexWrap': 'nowrap',
      'alignItems': 'flex-start',
      '@media (max-width: 768px)': {
        flexWrap: 'wrap',
      },
    },
    input: {
      ...dl.listInput,
      [STACK_QUERY]: {
        flex: '1 1 100%',
        width: '100%',
        minWidth: 0,
      },
    },
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
      gap: 0,
    },
    itemError: {
      ...dl.listError,
      fontSize: '12px',
    },
    actionBtn: {
      ...dl.listActionBtn,
      '&&': {
        ...dl.listActionBtn['&&'],
        [STACK_QUERY]: {
          width: '100%',
          minWidth: 0,
        },
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
      [STACK_QUERY]: {
        width: '100%',
      },
      '&:disabled': {
        opacity: OPACITY.STRONG,
        cursor: 'not-allowed' as const,
      },
      '&:hover:not(:disabled)': {
        opacity: OPACITY.OVERLAY,
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
