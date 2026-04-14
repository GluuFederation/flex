import { makeStyles } from 'tss-react/mui'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { fontSizes, fontWeights, lineHeights } from '@/styles/fonts'
import { getLoadingOverlayRgba } from '@/customColors'
import { getHoverOpacity } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { ClientWizardFormStyleParams } from 'Plugins/auth-server/components/OidcClients/types'

const WIZARD_STEP_ICON_SIZE = 32
const WIZARD_SECTION_GAP = SPACING.SECTION_GAP

export const useStyles = makeStyles<ClientWizardFormStyleParams>()((_, { themeColors, isDark }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBackground = themeColors.settings?.cardBackground ?? themeColors.card.background
  const activeStepColor = themeColors.formFooter.apply.backgroundColor
  const activeStepIconColor = themeColors.formFooter.apply.textColor
  const completeStepColor = themeColors.badges.filledBadgeBg
  const completeStepIconColor = themeColors.badges.filledBadgeText
  const mutedStepColor = themeColors.lightBackground
  const mutedStepIconColor = isDark
    ? getLoadingOverlayRgba(themeColors.fontColor, getHoverOpacity(isDark))
    : themeColors.textMuted
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
    wizardNav: {
      'overflowX': 'auto',
      'paddingBottom': 4,
      '& .wizard': {
        gap: 0,
      },
      '& .wizard > div': {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
      },
      '& .wizard-step': {
        flex: '0 0 auto',
        marginLeft: '0 !important',
      },
      '& .wizard-step__icon': {
        width: WIZARD_STEP_ICON_SIZE,
        height: WIZARD_STEP_ICON_SIZE,
        flex: `0 0 ${WIZARD_STEP_ICON_SIZE}px`,
        backgroundColor: mutedStepColor,
        border: `1px solid ${isDark ? themeColors.borderColor : 'transparent'}`,
      },
      '& .wizard-step__icon > *': {
        color: `${mutedStepIconColor} !important`,
      },
      '& .wizard-step__content': {
        display: 'none',
      },
      '& .wizard-step--active .wizard-step__icon': {
        backgroundColor: activeStepColor,
        borderColor: 'transparent',
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
      '& label, & label h5, & label span, & h5, & h4, & .MuiSvgIcon-root, & .fa': {
        color: `${themeColors.fontColor} !important`,
      },
    },
    footer: {
      padding: `0 ${SPACING.CARD_PADDING}px ${SPACING.CARD_PADDING}px`,
    },
  }
})
