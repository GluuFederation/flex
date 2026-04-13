import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { getDynamicListStyles } from '@/styles/dynamicListStyles'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'

interface SettingsStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<SettingsStylesParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const settings = themeColors.settings

  const customParamsBorder = isDark ? customColors.darkBorder : customColors.borderInput

  const dl = getDynamicListStyles({
    boxBg: settings.formInputBackground,
    inputBg: settings.cardBackground,
    borderColor: customParamsBorder,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
    errorColor: themeColors.errorColor,
  })

  return {
    settingsCard: {
      backgroundColor: settings.cardBackground,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: '100%',
      minHeight: 480,
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    header: {
      paddingTop: `${SPACING.CONTENT_PADDING}px`,
      paddingLeft: `${SPACING.CONTENT_PADDING}px`,
      paddingRight: `${SPACING.CONTENT_PADDING}px`,
      paddingBottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      minHeight: 84,
    },
    headerTitle: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      margin: 0,
    },
    headerSubtitle: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.relaxed,
      color: themeColors.textMuted,
      margin: 0,
    },
    headerDivider: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      borderBottom: `1px solid ${themeColors.borderColor}`,
      zIndex: 0,
    },
    settingsLabels: {
      '& label, & label h5, & label .MuiSvgIcon-root': {
        color: `${themeColors.fontColor} !important`,
        fontFamily: fontFamily,
        fontSize: fontSizes.base,
        fontStyle: 'normal',
        fontWeight: fontWeights.semiBold,
        lineHeight: 'normal',
        letterSpacing: letterSpacing.normal,
      },
    },
    content: {
      paddingTop: `${SPACING.PAGE}px`,
      paddingLeft: 52,
      paddingRight: 52,
      paddingBottom: `${SPACING.CONTENT_PADDING}px`,
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      [theme.breakpoints.down('sm')]: {
        paddingLeft: `${SPACING.PAGE}px`,
        paddingRight: `${SPACING.PAGE}px`,
      },
    },
    formSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      columnGap: SPACING.SECTION_GAP,
      rowGap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
    fieldItem: {
      'width': '100%',
      'minWidth': 0,
      'boxSizing': 'border-box' as const,
      '& .form-group': {
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
      },
      '& .form-group.row': {
        marginLeft: 0,
        marginRight: 0,
      },
      '& .form-group > label': {
        flex: '0 0 auto',
        width: '100%',
        maxWidth: '100%',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 6,
      },
      '& .form-group div[class*="col"]': {
        flex: '0 0 100%',
        width: '100%',
        maxWidth: '100%',
        paddingLeft: 0,
        paddingRight: 0,
        position: 'relative',
        paddingBottom: 20,
      },
      '& [data-field-error]': {
        position: 'absolute',
        fontSize: `${fontSizes.sm} !important`,
      },
      '& .input-group': {
        margin: 0,
      },
    },
    fieldItemFullWidth: {
      width: '100%',
      gridColumn: '1 / -1',
    },
    formWithInputs: {
      '& input, & select, & .custom-select': {
        backgroundColor: `${settings.formInputBackground} !important`,
        border: `1px solid ${settings.inputBorder}`,
        borderRadius: BORDER_RADIUS.SMALL,
        color: `${themeColors.fontColor} !important`,
        minHeight: 52,
        height: 'auto',
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 21,
        paddingRight: 21,
      },
      '& select, & .custom-select': {
        paddingRight: 44,
      },
      '& input:focus, & input:active, & select:focus, & select:active, & .custom-select:focus, & .custom-select:active':
        {
          backgroundColor: `${settings.formInputBackground} !important`,
          color: `${themeColors.fontColor} !important`,
          border: `1px solid ${settings.inputBorder} !important`,
          outline: 'none !important',
          boxShadow: 'none !important',
        },
      '& input:focus-visible, & select:focus-visible': {
        outline: 'none !important',
        boxShadow: 'none !important',
      },
      '& input:disabled, & select:disabled, & .custom-select:disabled': {
        backgroundColor: `${settings.formInputBackground} !important`,
        border: `1px solid ${settings.inputBorder} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: 1,
        cursor: 'not-allowed',
      },
      '& input::placeholder': {
        color: `${themeColors.textMuted} !important`,
      },
    },
    customParamsBox: { ...dl.listBox, marginTop: SPACING.CARD_CONTENT_GAP + 20 },
    customParamsBoxEmpty: dl.listBoxEmpty,
    customParamsHeader: dl.listHeader,
    customParamsHeaderEmpty: dl.listHeaderEmpty,
    customParamsTitle: dl.listTitle,
    customParamsBody: dl.listBody,
    customParamsRow: dl.listRow,
    customParamsActionBtn: dl.listActionBtn,
    customParamsInput: dl.listInput,
    customParamsError: dl.listError,
  }
})
