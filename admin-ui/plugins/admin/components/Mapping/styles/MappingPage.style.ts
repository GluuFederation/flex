import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import customColors, { hexToRgb } from '@/customColors'
import { fontFamily, fontWeights, fontSizes, letterSpacing } from '@/styles/fonts'
import {
  MAPPING_SPACING,
  SPACING,
  BORDER_RADIUS,
  MOBILE_MEDIA_QUERY,
  MOBILE_PAGE_PADDING_X,
  NAVBAR_DESKTOP_PADDING_X,
  DESKTOP_MIN_MEDIA_QUERY,
  TINY_MAX_MEDIA_QUERY,
} from '@/constants/ui'
import { createInfoAlertStyles } from '@/styles/formStyles'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

interface ThemeColors {
  fontColor: string
  textMuted: string
  card: {
    background: string
    border: string
  }
  infoAlert: {
    background: string
    border: string
    text: string
    icon: string
  }
  checkbox: {
    uncheckedBorder: string
  }
}

interface MappingPageStyleParams {
  isDark: boolean
  theme: ThemeColors
}

export const useStyles = makeStyles<MappingPageStyleParams>()(
  (muiTheme: Theme, { isDark, theme }) => ({
    mobileContentPad: {
      // On desktop the navbar logo sits NAVBAR_DESKTOP_PADDING_X (60px) from the
      // viewport edge, but `.layout__content` only insets page content by
      // SPACING.PAGE (24px). Add the difference so the page content's left edge
      // lines up exactly under the logo. Below 992px the navbar drops to the
      // 24px inset, which already matches the layout, so no extra padding there.
      [`@media ${DESKTOP_MIN_MEDIA_QUERY}`]: {
        paddingLeft: `${NAVBAR_DESKTOP_PADDING_X - SPACING.PAGE}px`,
        paddingRight: `${NAVBAR_DESKTOP_PADDING_X - SPACING.PAGE}px`,
        boxSizing: 'border-box',
      },
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingLeft: `${MOBILE_PAGE_PADDING_X.MD}px`,
        paddingRight: `${MOBILE_PAGE_PADDING_X.MD}px`,
        marginTop: `-${SPACING.PAGE / 2}px`,
        boxSizing: 'border-box',
      },
      [muiTheme.breakpoints.down('sm')]: {
        paddingLeft: `${MOBILE_PAGE_PADDING_X.SM}px`,
        paddingRight: `${MOBILE_PAGE_PADDING_X.SM}px`,
      },
    },

    pageWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },

    pageHeader: {
      display: 'flex',
      flexDirection: 'column',
      gap: MAPPING_SPACING.TITLE_TO_SUBTITLE,
      marginBottom: MAPPING_SPACING.HEADER_TO_INFO,
    },

    pageTitle: {
      fontFamily,
      fontSize: fontSizes['2.5xl'],
      fontWeight: fontWeights.bold,
      lineHeight: 1.15,
      letterSpacing: letterSpacing.normal,
      color: theme.fontColor,
      margin: 0,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        fontSize: '28px',
        lineHeight: '32px',
      },
    },

    pageDescription: {
      fontFamily,
      fontSize: fontSizes.content,
      fontWeight: fontWeights.semiBold,
      lineHeight: 1.5,
      letterSpacing: letterSpacing.normal,
      color: theme.fontColor,
      margin: 0,
    },

    sectionSpacing: {
      marginBottom: SPACING.SECTION_GAP,
    },

    ...createInfoAlertStyles(theme.infoAlert),

    // Figma aligns the info icon with the first line of text (top), not the
    // vertical center of the whole multi-line block that the shared helper uses.
    infoAlertTopAligned: {
      alignItems: 'flex-start',
    },

    infoLink: {
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      color: theme.fontColor,
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },

    roleCard: {
      ...getCardBorderStyle({ isDark }),
      backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
      borderRadius: BORDER_RADIUS.DEFAULT,
      marginBottom: SPACING.SECTION_GAP,
      overflow: 'visible',
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        borderRadius: BORDER_RADIUS.MEDIUM_SMALL,
      },
    },

    roleCardHeader: {
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'space-between',
      'position': 'relative',
      'zIndex': 1,
      'gap': 12,
      'padding': `0 ${MAPPING_SPACING.CARD_PADDING}px`,
      'minHeight': MAPPING_SPACING.CARD_HEADER_HEIGHT,
      'cursor': 'pointer',
      'transition': 'background-color 0.2s ease',
      'borderRadius': 'inherit',
      '&:hover': {
        backgroundColor: isDark
          ? `rgba(${hexToRgb(customColors.white)}, 0.02)`
          : `rgba(${hexToRgb(customColors.black)}, 0.02)`,
      },
      [`@media ${TINY_MAX_MEDIA_QUERY}`]: {
        gap: 8,
        paddingLeft: MOBILE_PAGE_PADDING_X.MD,
        paddingRight: MOBILE_PAGE_PADDING_X.MD,
        paddingTop: 12,
        paddingBottom: 12,
      },
    },

    roleCardHeaderExpanded: {
      borderBottom: `1px solid ${theme.card.border}`,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },

    roleTitle: {
      fontFamily,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.medium,
      lineHeight: 1,
      color: theme.fontColor,
      margin: 0,
      padding: 0,
      display: 'block',
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      [`@media ${TINY_MAX_MEDIA_QUERY}`]: {
        fontSize: fontSizes.md,
      },
    },

    roleHeaderRight: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0,
    },

    permissionCount: {
      fontFamily,
      fontSize: '15px',
      fontWeight: fontWeights.medium,
      lineHeight: 1,
      color: theme.fontColor,
      margin: 0,
      padding: 0,
      display: 'block',
      whiteSpace: 'nowrap',
      [`@media ${TINY_MAX_MEDIA_QUERY}`]: {
        fontSize: fontSizes.sm,
      },
    },

    permissionCountHighlight: {
      color: customColors.statusActive,
    },

    chevronIcon: {
      width: 18,
      height: 18,
      color: theme.fontColor,
      transition: 'transform 0.3s ease',
    },

    chevronIconOpen: {
      transform: 'rotate(180deg)',
    },

    roleCardContent: {
      position: 'relative',
      zIndex: 1,
      padding: MAPPING_SPACING.CARD_PADDING,
      paddingTop: MAPPING_SPACING.CONTENT_PADDING_TOP,
      borderBottomLeftRadius: BORDER_RADIUS.DEFAULT,
      borderBottomRightRadius: BORDER_RADIUS.DEFAULT,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        borderBottomLeftRadius: BORDER_RADIUS.MEDIUM_SMALL,
        borderBottomRightRadius: BORDER_RADIUS.MEDIUM_SMALL,
      },
    },

    permissionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: `${MAPPING_SPACING.PERMISSION_ROW_GAP}px ${MAPPING_SPACING.PERMISSION_ITEM_GAP}px`,
      alignItems: 'start',
      width: '100%',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        gridTemplateColumns: '1fr',
      },
    },

    permissionItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: MAPPING_SPACING.CHECKBOX_LABEL_GAP,
      cursor: 'default',
      minWidth: 0,
    },

    checkbox: {
      width: MAPPING_SPACING.CHECKBOX_SIZE,
      height: MAPPING_SPACING.CHECKBOX_SIZE,
      borderRadius: MAPPING_SPACING.CHECKBOX_BORDER_RADIUS,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    checkboxChecked: {
      backgroundColor: isDark ? 'transparent' : customColors.white,
      border: `${MAPPING_SPACING.CHECKBOX_BORDER_WIDTH}px solid ${customColors.statusActive}`,
    },

    checkboxUnchecked: {
      backgroundColor: isDark ? 'transparent' : customColors.white,
      border: `${MAPPING_SPACING.CHECKBOX_BORDER_WIDTH}px solid ${theme.checkbox.uncheckedBorder}`,
    },

    checkIcon: {
      width: MAPPING_SPACING.CHECK_ICON_SIZE,
      height: MAPPING_SPACING.CHECK_ICON_SIZE,
      color: customColors.statusActive,
    },

    permissionLabel: {
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      lineHeight: 'normal',
      color: isDark ? customColors.white : customColors.black,
      minWidth: 0,
      overflowWrap: 'anywhere',
      wordBreak: 'break-word',
    },

    noPermissions: {
      fontFamily,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      color: theme.textMuted,
      fontStyle: 'italic',
    },

    errorAlert: {
      marginBottom: MAPPING_SPACING.CARD_MARGIN_BOTTOM,
    },

    infoEmptyState: {
      marginBottom: MAPPING_SPACING.CARD_MARGIN_BOTTOM,
      backgroundColor: theme.infoAlert.background,
      border: `1px solid ${theme.infoAlert.border}`,
      borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      padding: `${MAPPING_SPACING.INFO_ALERT_PADDING_VERTICAL}px ${MAPPING_SPACING.INFO_ALERT_PADDING_HORIZONTAL}px`,
    },
  }),
)
