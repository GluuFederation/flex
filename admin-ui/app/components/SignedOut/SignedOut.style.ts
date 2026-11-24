import { makeStyles } from 'tss-react/mui'
import { keyframes } from '@emotion/react'
import customColors, { getLoadingOverlayRgba } from '@/customColors'
import { fontFamily, fontSizes, fontWeights, lineHeights } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/config'

type SignedOutStyleParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const LOGO_WIDTH = 150
const PAGE_GAP = 40
const PAGE_PADDING = '32px 16px'
const CARD_MAX_WIDTH = 432
const CARD_PADDING = 40
const CARD_RADIUS = 18
const TITLE_LINE_HEIGHT = 1.5
const TITLE_LETTER_SPACING = '-0.01em'
const TITLE_GAP = 6
const DESCRIPTION_GAP = 32
const BUTTON_PADDING = '12px 16px'
const BUTTON_RADIUS = 10
const FOCUS_RING_WIDTH = 2
const FOCUS_RING_OFFSET = 3
const GLOW = 'radial-gradient(768px 544px at 82% 88%'
const CARD_ENTER_DURATION = '0.45s'
const CARD_ENTER_EASING = 'cubic-bezier(0.22, 0.75, 0.3, 1)'

const ACCENT_SOFT_ALPHA = 0.16
const SHADOW_ALPHA_DARK = 0.55
const SHADOW_ALPHA_LIGHT = 0.14

const cardEnter = keyframes({
  '0%': { opacity: 0, transform: 'translateY(14px)' },
  '100%': { opacity: 1, transform: 'none' },
})

const useStyles = makeStyles<SignedOutStyleParams>()((theme, { isDark, themeColors }) => {
  const accentSoft = getLoadingOverlayRgba(customColors.logo, ACCENT_SOFT_ALPHA)
  const shadow = isDark
    ? `0 24px 60px ${getLoadingOverlayRgba(customColors.black, SHADOW_ALPHA_DARK)}`
    : `0 20px 45px ${getLoadingOverlayRgba(customColors.primaryDark, SHADOW_ALPHA_LIGHT)}`

  return {
    page: {
      position: 'fixed',
      inset: 0,
      zIndex: theme.zIndex.modal,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: PAGE_GAP,
      padding: PAGE_PADDING,
      margin: 0,
      background: `${GLOW}, ${accentSoft}, transparent 70%), ${themeColors.background}`,
      color: themeColors.fontColor,
      fontFamily,
    },
    logo: {
      width: LOGO_WIDTH,
      height: 'auto',
      maxWidth: '100%',
    },
    card: {
      'boxSizing': 'border-box',
      'width': '100%',
      'maxWidth': CARD_MAX_WIDTH,
      'padding': CARD_PADDING,
      'border': `1px solid ${themeColors.card.border}`,
      'borderRadius': CARD_RADIUS,
      'backgroundColor': themeColors.card.background,
      'boxShadow': shadow,
      'textAlign': 'center',
      'animation': `${cardEnter} ${CARD_ENTER_DURATION} ${CARD_ENTER_EASING} both`,
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },
    title: {
      margin: 0,
      marginBottom: TITLE_GAP,
      color: themeColors.fontColor,
      fontSize: fontSizes.pageTitle,
      fontWeight: fontWeights.bold,
      lineHeight: TITLE_LINE_HEIGHT,
      letterSpacing: TITLE_LETTER_SPACING,
      overflowWrap: 'anywhere',
    },
    description: {
      margin: 0,
      marginBottom: DESCRIPTION_GAP,
      color: isDark ? customColors.cedarTextSecondaryDark : themeColors.textMuted,
      fontSize: fontSizes.md,
      lineHeight: lineHeights.base,
      overflowWrap: 'anywhere',
    },
    button: {
      'display': 'block',
      'width': '100%',
      'padding': BUTTON_PADDING,
      'border': 0,
      'borderRadius': BUTTON_RADIUS,
      'backgroundColor': customColors.logo,
      'boxShadow': `0 8px 20px ${accentSoft}`,
      'color': customColors.primaryDark,
      'cursor': 'pointer',
      fontFamily,
      'fontSize': fontSizes.md,
      'fontWeight': fontWeights.semiBold,
      'lineHeight': lineHeights.base,
      'transition': 'transform 0.15s, filter 0.2s',
      '&:hover': {
        filter: 'brightness(1.08)',
        transform: 'translateY(-1px)',
      },
      '&:focus-visible': {
        outline: `${FOCUS_RING_WIDTH}px solid ${customColors.logo}`,
        outlineOffset: FOCUS_RING_OFFSET,
      },
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  }
})

export { useStyles }
