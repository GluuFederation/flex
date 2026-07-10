import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

const MOBILE_MEDIA_QUERY = '(max-width:767px)'
// Below this width the 16px header title runs into the refresh icon.
const NARROW_MEDIA_QUERY = '(max-width:350px)'

interface HealthPageThemeColors {
  cardBg: string
  navbarBorder: string
  text: string
  errorColor: string
  infoMessageColor: string
}

const useStyles = makeStyles<{ themeColors: HealthPageThemeColors; isDark: boolean }>()((
  theme: Theme,
  params,
) => {
  const { themeColors, isDark } = params

  const cardBorderStyle = getCardBorderStyle({
    isDark,
  })

  return {
    // Screen-edge inset for the page on mobile. Figma insets the card 30px from
    // each side (matching the Dashboard mobile layout); apply the same padding
    // so the Health page lines up with the rest of the mobile design system.
    mobileContentPad: {
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingLeft: '30px',
        paddingRight: '30px',
        boxSizing: 'border-box',
      },
    },
    mobilePageTitle: {
      display: 'none',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        display: 'block',
        fontFamily,
        fontSize: '28px',
        fontStyle: 'normal',
        fontWeight: fontWeights.bold,
        lineHeight: 'normal',
        color: themeColors.text,
        margin: 0,
        // Figma gap from the heading baseline to the card top is ~34px.
        marginBottom: '34px',
      },
    },
    healthCard: {
      backgroundColor: themeColors.cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: 0,
      width: '100%',
      minHeight: 616,
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        minHeight: 'auto',
      },
    },
    header: {
      paddingTop: `${SPACING.CONTENT_PADDING}px`,
      paddingLeft: `${SPACING.CONTENT_PADDING}px`,
      paddingRight: `${SPACING.CONTENT_PADDING}px`,
      paddingBottom: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative',
      height: '84.5px',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        height: '58.5px',
        alignItems: 'flex-start',
        paddingTop: '20px',
        paddingLeft: '28px',
        paddingRight: '28px',
      },
    },
    headerTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.md,
      lineHeight: lineHeights.tight,
      color: themeColors.text,
      margin: 0,
      // Without min-width:0 a flex item refuses to shrink below its content
      // width, so the title would run under the refresh button.
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      [`@media ${NARROW_MEDIA_QUERY}`]: {
        fontSize: fontSizes.base,
      },
    },
    headerDivider: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      borderBottom: `1px solid ${themeColors.navbarBorder}`,
      zIndex: 0,
    },
    refreshButtonWrapper: {
      position: 'absolute',
      right: `${SPACING.CONTENT_PADDING}px`,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      // In flow on mobile so it reserves its width and the title cannot overlap.
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        position: 'static',
        transform: 'none',
        flexShrink: 0,
        // The title is conditional; keeps the button right-aligned when it is
        // the header's only in-flow child.
        marginLeft: 'auto',
        // Centres the 22px icon inside the button's 32px mobile box.
        marginTop: `${-(32 - 22) / 2}px`,
      },
    },
    refreshButton: {
      borderRadius: 4,
      height: 44,
      minHeight: 44,
      minWidth: 108,
      padding: '0 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 8,
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.relaxed,
      // Icon-only on mobile per Figma: strip the button chrome and collapse the
      // text label to zero size. GluuButton applies these via INLINE styles, so
      // every override here must use !important to win over the inline values.
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        'minWidth': 'auto !important',
        'width': '32px !important',
        'height': '32px !important',
        'minHeight': '32px !important',
        'padding': '0 !important',
        'gap': '0 !important',
        'fontSize': '0 !important',
        'border': 'none !important',
        'borderColor': 'transparent !important',
        'backgroundColor': 'transparent !important',
        // Keep the refresh icon itself visible at a fixed size.
        '& svg, & .MuiSvgIcon-root': {
          fontSize: '22px !important',
        },
      },
    },
    messageBlock: {
      padding: `${SPACING.CONTENT_PADDING}px`,
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
    },
    errorMessage: {
      color: themeColors.errorColor,
    },
    infoMessage: {
      color: themeColors.infoMessageColor,
    },
    errorIcon: {
      color: 'inherit',
      flexShrink: 0,
    },
    infoIcon: {
      color: 'inherit',
      flexShrink: 0,
    },
    servicesGrid: {
      paddingTop: `${SPACING.SECTION_GAP}px`,
      paddingLeft: `${SPACING.CONTENT_PADDING}px`,
      paddingRight: `${SPACING.CONTENT_PADDING}px`,
      paddingBottom: `${SPACING.CONTENT_PADDING}px`,
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      width: '100%',
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: SPACING.CARD_GAP,
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        gridTemplateColumns: '1fr',
        gap: 12,
        paddingTop: '20.5px',
        paddingLeft: '28.5px',
        paddingRight: '28.5px',
        paddingBottom: '26px',
      },
    },
    serviceCardWrapper: {
      minWidth: 0,
    },
    refreshIcon: {
      fontSize: 16,
    },
  }
})

export { useStyles }
