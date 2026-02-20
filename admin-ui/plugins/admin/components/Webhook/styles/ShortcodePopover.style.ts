import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'

interface ShortcodePopoverStylesParams {
  themeColors: ThemeConfig
}

const CONTENT_MAX_HEIGHT = '300px'
const CONTENT_MIN_WIDTH = 200
const CONTENT_MAX_WIDTH = 260
const HELP_ICON_SIZE = 18
const HELP_ICON_MARGIN = 6
const EMPTY_MESSAGE_PADDING = 16

export const useStyles = makeStyles<ShortcodePopoverStylesParams>()((_theme, { themeColors }) => {
  const paperBg = themeColors.settings?.cardBackground ?? themeColors.card?.background
  const hoverBg = themeColors.settings?.customParamsBox ?? themeColors.inputBackground

  return {
    paper: {
      backgroundColor: paperBg,
      border: `1px solid ${themeColors.borderColor}`,
      color: themeColors.fontColor,
    },
    content: {
      maxHeight: CONTENT_MAX_HEIGHT,
      overflowY: 'auto',
      width: '100%',
      minWidth: CONTENT_MIN_WIDTH,
      maxWidth: CONTENT_MAX_WIDTH,
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
      padding: EMPTY_MESSAGE_PADDING,
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
