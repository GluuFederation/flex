import { makeStyles } from 'tss-react/mui'
import { BORDER_RADIUS, SPACING, ICON_SIZE } from '@/constants'
import { fontSizes, fontWeights, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { ClientWizardFormStyleParams } from 'Plugins/auth-server/components/OidcClients/types'

const WIZARD_STEP_ICON_SIZE = 32
const WIZARD_SECTION_GAP = SPACING.SECTION_GAP

export const useStyles = makeStyles<ClientWizardFormStyleParams>()((_, { themeColors, isDark }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBackground = themeColors.settings?.cardBackground ?? themeColors.card.background
  const activeStepColor = themeColors.fontColor
  const activeStepIconColor = themeColors.background
  const completeStepColor = themeColors.badges.filledBadgeBg
  const completeStepIconColor = themeColors.badges.filledBadgeText
  const mutedStepColor = themeColors.inputBackground
  const mutedStepIconColor = themeColors.fontColor
  return {
    pageCard: {
      'backgroundColor': cardBackground,
      ...cardBorderStyle,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'minHeight': '70vh',
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
    },
    downloadButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
    },
    downloadButtonIcon: {
      fontSize: ICON_SIZE.SM,
      marginRight: 4,
      flexShrink: 0,
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
      padding: `0 ${SPACING.CARD_PADDING}px ${WIZARD_SECTION_GAP}px`,
    },
    wizardSectionCompact: {
      flex: '0 0 auto',
    },
    wizardNav: {
      'overflowX': 'auto',
      '& .wizard': {
        justifyContent: 'space-between',
      },
      '& .wizard > div': {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
      },
      '& .wizard-step': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0,
        marginLeft: '0 !important',
      },
      '& .wizard-step__icon': {
        width: WIZARD_STEP_ICON_SIZE,
        height: WIZARD_STEP_ICON_SIZE,
        flex: `0 0 ${WIZARD_STEP_ICON_SIZE}px`,
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
      'color': themeColors.fontColor,
      'padding': `0 ${SPACING.CARD_PADDING}px ${SPACING.CARD_PADDING}px`,
      'paddingTop': '0 !important',
      '& label, & label h5, & label span, & h5, & h4, & .MuiSvgIcon-root, & .fa': {
        color: `${themeColors.fontColor} !important`,
      },
    },
    contentSectionCompact: {
      paddingTop: '0 !important',
    },
    footer: {
      padding: `0 ${SPACING.CARD_PADDING}px ${SPACING.CARD_PADDING}px`,
    },
  }
})
