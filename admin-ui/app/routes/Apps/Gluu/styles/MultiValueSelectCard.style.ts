import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { CEDARLING_CONFIG_SPACING, MAPPING_SPACING } from '@/constants'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'
import applicationStyle from './applicationStyle'

interface MultiValueSelectCardStyleParams {
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<MultiValueSelectCardStyleParams>()((_, { themeColors }) => {
  const settings = themeColors.settings
  const inputBorderColor = settings?.inputBorder ?? themeColors.borderColor
  const leftFieldBg = themeColors.settings?.cardBackground ?? themeColors.card.background

  return {
    card: {
      backgroundColor: leftFieldBg,
      border: `1px solid ${inputBorderColor}`,
      borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
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
      'gridTemplateColumns': 'minmax(0, 1fr) auto',
      'gap': 12,
      'alignItems': 'center',
      '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
      },
    },
    selectWrapper: {
      position: 'relative',
      flex: '1 1 0',
      minWidth: 0,
    },
    select: {
      'width': '100%',
      'minHeight': CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
      'backgroundColor': themeColors.inputBackground,
      '&&': {
        backgroundColor: `${themeColors.inputBackground} !important`,
      },
      'color': themeColors.fontColor,
      'border': `1px solid ${inputBorderColor}`,
      'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      'paddingTop': CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
      'paddingBottom': CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
      'paddingLeft': 21,
      'paddingRight': 44,
      'boxSizing': 'border-box' as const,
      'fontSize': 14,
      'fontFamily': 'inherit',
      'WebkitAppearance': 'none' as const,
      'MozAppearance': 'none' as const,
      'appearance': 'none' as const,
      'backgroundImage': 'none',
      'outline': 'none',
      'cursor': 'pointer',
      '&:focus': {
        backgroundImage: 'none',
        outline: 'none',
        boxShadow: 'none',
      },
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    },
    chevronWrapper: {
      position: 'absolute',
      right: 20,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: themeColors.fontColor,
      zIndex: 6,
    },
    addButton: {
      '&&': {
        display: 'inline-flex',
        minHeight: 44,
        height: 44,
        padding: '8px 20px',
        gap: 8,
        flexShrink: 0,
        justifyContent: 'center',
        alignItems: 'center',
        color: `${themeColors.formFooter.apply.textColor} !important`,
        fontFamily,
        fontSize: fontSizes.base,
        fontStyle: 'normal',
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.button,
      },
      '& *': {
        color: 'inherit',
      },
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
      backgroundColor: themeColors.badges.statusActiveBg,
      color: themeColors.badges.statusActive,
      border: `1px solid ${themeColors.badges.statusActive}`,
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
      'background': themeColors.badges.statusActive,
      'color': themeColors.badges.filledBadgeText,
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
      'marginRight': 0,
      'background': 'transparent',
      'border': 'none',
      'boxShadow': 'none',
      'flexShrink': 0,
      'color': themeColors.fontColor,
      '&:hover': {
        opacity: 0.8,
      },
      '&:focus-visible': {
        outline: `2px solid ${themeColors.fontColor}`,
        outlineOffset: 2,
      },
      '& i': {
        fontSize: 16,
        color: 'inherit',
      },
    },
  }
})
