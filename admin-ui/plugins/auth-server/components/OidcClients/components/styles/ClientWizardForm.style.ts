import { makeStyles } from 'tss-react/mui'
import {
  BORDER_RADIUS,
  SPACING,
  ICON_SIZE,
  MOBILE_MEDIA_QUERY,
  MOBILE_BOTTOM_NAV_HEIGHT,
  EXTRA_SMALL_MAX_MEDIA_QUERY,
  TINY_MAX_MEDIA_QUERY,
} from '@/constants'
import { fontSizes, fontWeights, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { createDisabledInputStyles } from '@/styles/disabledFieldStyles'
import type { ClientWizardFormStyleParams } from 'Plugins/auth-server/components/OidcClients/types'

const WIZARD_STEP_ICON_SIZE = 26
const WIZARD_SECTION_GAP = SPACING.SECTION_GAP
const WIZARD_STEP_GAP = SPACING.SECTION_GAP
const WIZARD_STEP_LABEL_GAP = 8
const COMPACT_BUTTON_FONT_SIZE = 13
const COMPACT_BUTTON_PADDING_X = 12
const COMPACT_BUTTON_PADDING_Y = 8
const TIGHT_BUTTON_FONT_SIZE = 11
const TIGHT_BUTTON_PADDING_X = 8
const TIGHT_BUTTON_ICON_GAP = 2

export const useStyles = makeStyles<ClientWizardFormStyleParams>()((_, { themeColors, isDark }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBackground = themeColors.settings?.cardBackground ?? themeColors.card.background
  const activeStepColor = themeColors.fontColor
  const activeStepIconColor = themeColors.background
  const completeStepColor = themeColors.badges.filledBadgeBg
  const completeStepIconColor = themeColors.badges.filledBadgeText
  const mutedStepColor = themeColors.inputBackground
  const mutedStepIconColor = themeColors.fontColor
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  return {
    pageCard: {
      'backgroundColor': cardBackground,
      ...cardBorderStyle,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'minHeight': '70vh',
      'display': 'flex',
      'flexDirection': 'column',
      'overflow': 'visible',
      'marginBottom': SPACING.PAGE,
      '& .card-body': {
        backgroundColor: `${cardBackground} !important`,
      },
    },
    downloadRow: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: SPACING.CARD_BUTTON_GAP,
      padding: `${WIZARD_SECTION_GAP}px ${SPACING.CARD_PADDING}px ${WIZARD_SECTION_GAP}px`,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        'gap': SPACING.CARD_CONTENT_GAP,
        '& button': {
          fontSize: `${COMPACT_BUTTON_FONT_SIZE}px !important`,
          padding: `${COMPACT_BUTTON_PADDING_Y}px ${COMPACT_BUTTON_PADDING_X}px !important`,
        },
      },
      [`@media ${EXTRA_SMALL_MAX_MEDIA_QUERY}`]: {
        '& button': {
          fontSize: `${TIGHT_BUTTON_FONT_SIZE}px !important`,
          padding: `${COMPACT_BUTTON_PADDING_Y}px ${TIGHT_BUTTON_PADDING_X}px !important`,
        },
      },
      [`@media ${TINY_MAX_MEDIA_QUERY}`]: {
        'flexDirection': 'column',
        'alignItems': 'stretch',
        '& button': {
          fontSize: `${COMPACT_BUTTON_FONT_SIZE}px !important`,
          padding: `${COMPACT_BUTTON_PADDING_Y}px ${COMPACT_BUTTON_PADDING_X}px !important`,
          width: '100% !important',
        },
      },
    },
    downloadButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      minWidth: 0,
      [`@media ${EXTRA_SMALL_MAX_MEDIA_QUERY}`]: {
        gap: TIGHT_BUTTON_ICON_GAP,
      },
      [`@media ${TINY_MAX_MEDIA_QUERY}`]: {
        gap: SPACING.CARD_CONTENT_GAP,
      },
    },
    downloadButtonIcon: {
      fontSize: ICON_SIZE.SM,
      marginRight: 4,
      flexShrink: 0,
      [`@media ${EXTRA_SMALL_MAX_MEDIA_QUERY}`]: {
        marginRight: TIGHT_BUTTON_ICON_GAP,
      },
      [`@media ${TINY_MAX_MEDIA_QUERY}`]: {
        marginRight: 4,
      },
    },
    filterButtonWrapper: {
      position: 'relative' as const,
    },
    stepNumber: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.normal,
    },
    wizardSection: {
      flex: '0 0 auto',
      padding: `0 ${SPACING.CARD_PADDING}px ${WIZARD_SECTION_GAP}px`,
    },
    wizardSectionCompact: {
      flex: '0 0 auto',
    },
    wizardNav: {
      'overflowX': 'visible',
      'contain': 'inline-size',
      '& .wizard': {
        'flexWrap': 'nowrap',
        'columnGap': WIZARD_STEP_GAP,
        'justifyContent': 'flex-start',
        'overflowX': 'auto',
        'scrollbarWidth': 'none',
        'msOverflowStyle': 'none',
        'WebkitOverflowScrolling': 'touch',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
      '& .wizard > div': {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
      },
      '& .wizard-step': {
        flex: '0 0 auto',
        flexDirection: 'row',
        alignItems: 'center',
        gap: WIZARD_STEP_LABEL_GAP,
        marginLeft: '0 !important',
        padding: 0,
      },
      '& .wizard-step__icon': {
        width: WIZARD_STEP_ICON_SIZE,
        height: WIZARD_STEP_ICON_SIZE,
        flex: `0 0 ${WIZARD_STEP_ICON_SIZE}px`,
        marginRight: 0,
        backgroundColor: mutedStepColor,
        border: `1px solid ${themeColors.borderColor}`,
      },
      '& .wizard-step__icon > *': {
        color: `${mutedStepIconColor} !important`,
      },
      '& .wizard-step__content': {
        color: mutedStepIconColor,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        lineHeight: lineHeights.tight,
        whiteSpace: 'nowrap',
      },
      '& .wizard-step--active .wizard-step__icon': {
        backgroundColor: activeStepColor,
        borderColor: 'transparent',
        boxShadow: 'none',
      },
      '& .wizard-step--active .wizard-step__icon > *': {
        color: `${activeStepIconColor} !important`,
      },
      '& .wizard-step--complete .wizard-step__icon': {
        backgroundColor: completeStepColor,
        borderColor: 'transparent',
      },
      '& .wizard-step--complete .wizard-step__icon > *': {
        color: `${completeStepIconColor} !important`,
      },
      '& .wizard-step--active .wizard-step__content, & .wizard-step--complete .wizard-step__content':
        {
          color: themeColors.fontColor,
        },
    },
    contentSection: {
      'flex': '0 0 auto',
      'color': themeColors.fontColor,
      'padding': `0 ${SPACING.CARD_PADDING}px 0`,
      'paddingTop': '0 !important',
      '& label, & label h5, & label span, & h5, & h4, & .MuiSvgIcon-root, & .fa': {
        color: `${themeColors.fontColor} !important`,
      },
      '& input:not([type="checkbox"]):not(.MuiOutlinedInput-input):disabled, & select:disabled, & .custom-select:disabled, & textarea:disabled, & select[aria-disabled="true"], & .custom-select[aria-disabled="true"], & input[aria-disabled="true"]:not([type="checkbox"]):not(.MuiOutlinedInput-input), & textarea[aria-disabled="true"]':
        {
          backgroundColor: `${formInputBg} !important`,
          border: `1px solid ${inputBorderColor} !important`,
          ...createDisabledInputStyles(themeColors.fontColor),
        },
    },
    contentSectionCompact: {
      paddingTop: '0 !important',
    },
    footer: {
      padding: `0 ${SPACING.CARD_PADDING}px ${SPACING.CARD_PADDING}px`,
      marginTop: 'auto',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        position: 'sticky',
        bottom: `calc(${MOBILE_BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`,
        backgroundColor: cardBackground,
        borderBottomLeftRadius: BORDER_RADIUS.DEFAULT,
        borderBottomRightRadius: BORDER_RADIUS.DEFAULT,
      },
    },
  }
})
