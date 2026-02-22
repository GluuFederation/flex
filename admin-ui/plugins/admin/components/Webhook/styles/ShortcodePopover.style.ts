import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'

interface ShortcodePopoverStylesParams {
  themeColors: ThemeConfig
}

const HELP_ICON_SIZE = 18
const HELP_ICON_MARGIN = 6
const MAX_POPOVER_HEIGHT = '300px'
const MIN_POPOVER_WIDTH = 200
const MAX_POPOVER_WIDTH = 260

export const useStyles = makeStyles<ShortcodePopoverStylesParams>()((_theme, { themeColors }) => {
  const paperBg =
    themeColors.settings?.cardBackground ??
    themeColors.card?.background ??
    themeColors.inputBackground
  const hoverBg = themeColors.settings?.customParamsBox ?? themeColors.inputBackground

  return {
    paper: {
      backgroundColor: paperBg,
      border: `1px solid ${themeColors.borderColor}`,
      color: themeColors.fontColor,
    },
    content: {
      maxHeight: MAX_POPOVER_HEIGHT,
      overflowY: 'auto',
      width: '100%',
      minWidth: MIN_POPOVER_WIDTH,
      maxWidth: MAX_POPOVER_WIDTH,
    },
    list: {
      color: themeColors.fontColor,
      backgroundColor: 'transparent',
    },
    listItemButton: {
      'width': '100%',
      'color': themeColors.fontColor,
      '&:hover': {
        backgroundColor: hoverBg,
      },
    },
    listItemText: {
      color: 'inherit',
    },
    divider: {
      borderColor: themeColors.borderColor,
    },
    emptyMessage: {
      margin: 0,
      padding: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: themeColors.fontColor,
    },
    labelText: {
      color: themeColors.fontColor,
    },
    helpIcon: {
      width: HELP_ICON_SIZE,
      height: HELP_ICON_SIZE,
      marginLeft: HELP_ICON_MARGIN,
      marginRight: HELP_ICON_MARGIN,
      color: themeColors.fontColor,
    },
  }
})
