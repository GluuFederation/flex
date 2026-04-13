import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'
import { getDynamicListStyles } from '@/styles/dynamicListStyles'

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
      'alignItems': 'center',
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
    actionBtn: dl.listActionBtn,
    headerActionBtn: {
      ...dl.listActionBtn,
      '&:focus, &:focus-visible, &:active': {
        outline: 'none !important',
        boxShadow: 'none !important',
      },
    },
    error: dl.listError,
  }
})
