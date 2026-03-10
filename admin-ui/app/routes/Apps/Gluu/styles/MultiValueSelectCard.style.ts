import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { CEDARLING_CONFIG_SPACING, MAPPING_SPACING, BORDER_RADIUS } from '@/constants'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'
import customColors from '@/customColors'
import applicationStyle from './applicationStyle'

interface MultiValueSelectCardStyleParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<MultiValueSelectCardStyleParams>()((
  _,
  { isDark, themeColors },
) => {
  const settings = themeColors.settings
  const inputBorderColor = settings?.inputBorder ?? themeColors.borderColor
  const leftFieldBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formInputBg = isDark
    ? (settings?.formInputBackground ?? themeColors.inputBackground)
    : (settings?.cardBackground ?? themeColors.card.background)

  return {
    card: {
      backgroundColor: leftFieldBg,
      border: `1px solid ${inputBorderColor}`,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: 16,
      boxSizing: 'border-box',
    },
    header: {
      color: themeColors.fontColor,
      fontWeight: 600,
      marginBottom: 12,
    },
    controls: {
      'display': 'grid',
      'gridTemplateColumns': 'minmax(0, 1fr) auto auto',
      'gap': 12,
      'alignItems': 'center',
      '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
      },
    },
    autocomplete: {
      'width': '100%',
      'flex': '1 1 0',
      'minWidth': 0,
      '& .MuiOutlinedInput-root': {
        'backgroundColor': `${formInputBg} !important`,
        'minHeight': CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
        'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px !important`,
        'overflow': 'hidden',
        'border': `1px solid ${inputBorderColor}`,
        'outline': 'none',
        'boxShadow': 'none',
        'color': `${themeColors.fontColor} !important`,
        'caretColor': themeColors.fontColor,
        '& .MuiOutlinedInput-notchedOutline': { display: 'none' },
        '& fieldset': { display: 'none', border: 'none' },
        '&:hover': {
          border: `1px solid ${inputBorderColor}`,
          backgroundColor: `${formInputBg} !important`,
        },
        '&.Mui-focused, &.Mui-focusVisible': {
          border: `1px solid ${inputBorderColor} !important`,
          backgroundColor: `${formInputBg} !important`,
          boxShadow: 'none',
          outline: 'none',
        },
        '& .MuiOutlinedInput-input': {
          paddingTop: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
          paddingBottom: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
          paddingLeft: 21,
          paddingRight: 21,
          boxSizing: 'border-box',
          border: 'none !important',
          borderRadius: 0,
          outline: 'none',
          backgroundColor: 'transparent !important',
          boxShadow: 'none !important',
          color: `${themeColors.fontColor} !important`,
          caretColor: themeColors.fontColor,
        },
        '& .MuiOutlinedInput-input::placeholder': {
          color: `${themeColors.textMuted} !important`,
          opacity: '1 !important',
        },
      },
      '& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator': {
        color: `${themeColors.fontColor} !important`,
      },
    },
    buttons: {
      'display': 'flex',
      'gap': 12,
      'justifyContent': 'flex-end',
      '@media (max-width: 900px)': {
        justifyContent: 'flex-start',
      },
    },
    addButton: {
      'display': 'inline-flex',
      'height': 52,
      'padding': '20px 28px',
      'justifyContent': 'center',
      'alignItems': 'center',
      'color': `${themeColors.formFooter.apply.textColor} !important`,
      fontFamily,
      'fontSize': fontSizes.base,
      'fontStyle': 'normal',
      'fontWeight': fontWeights.bold,
      'lineHeight': lineHeights.normal,
      'letterSpacing': letterSpacing.button,
      '& *': {
        color: 'inherit',
      },
    },
    removeButton: {
      display: 'inline-flex',
      height: 52,
      padding: '20px 28px',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      background: themeColors.settings?.removeButton?.bg ?? customColors.statusInactive,
    },
    tags: {
      marginTop: 12,
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
    },
    tag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 4px 4px 10px',
      borderRadius: 999,
      backgroundColor: customColors.statusActiveBg,
      color: customColors.statusActive,
      border: `1px solid ${customColors.statusActive}`,
      fontSize: 12,
      lineHeight: '18px',
      fontWeight: 600,
    },
    tagRemove: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': 22,
      'height': 22,
      'borderRadius': '50%',
      'border': 'none',
      'background': customColors.statusActive,
      'color': customColors.white,
      'fontSize': 13,
      'lineHeight': 1,
      'cursor': 'pointer',
      'padding': 0,
      '&:hover': {
        opacity: 0.8,
      },
    },
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    cardWrapper: {
      flex: 1,
      minWidth: 0,
    },
    removeFieldButton: {
      ...(applicationStyle.removableInputRow as object),
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'width': 32,
      'height': 32,
      'minWidth': 32,
      'minHeight': 32,
      'padding': 6,
      '& i': {
        fontSize: 16,
      },
    },
  }
})
