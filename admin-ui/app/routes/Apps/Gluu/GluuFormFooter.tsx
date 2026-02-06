import { useMemo, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_DARK } from '@/context/theme/constants'
import { Box, Divider } from '@mui/material'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { GluuButton } from '@/components'
import { useStyles, BUTTON_STYLES, getButtonColors } from './styles/GluuFormFooter.style'

interface GluuFormFooterBaseProps {
  showBack?: boolean
  backButtonLabel?: string
  onBack?: () => void
  disableBack?: boolean
  showCancel?: boolean
  cancelButtonLabel?: string
  onCancel?: () => void
  disableCancel?: boolean
  showApply?: boolean
  disableApply?: boolean
  applyButtonLabel?: string
  isLoading?: boolean
  className?: string
  hideDivider?: boolean
}

type GluuFormFooterProps = GluuFormFooterBaseProps &
  (
    | { applyButtonType?: 'submit'; onApply?: () => void }
    | { applyButtonType: 'button'; onApply: () => void }
  )

const COMMON_BUTTON_STYLE = {
  minHeight: BUTTON_STYLES.height,
  padding: `${BUTTON_STYLES.paddingY}px ${BUTTON_STYLES.paddingX}px`,
  borderRadius: BUTTON_STYLES.borderRadius,
  fontSize: BUTTON_STYLES.fontSize,
  fontWeight: BUTTON_STYLES.fontWeight,
  letterSpacing: BUTTON_STYLES.letterSpacing,
}

const SHARED_BUTTON_PROPS = {
  useOpacityOnHover: true,
  hoverOpacity: 0.85,
  style: COMMON_BUTTON_STYLE,
}

const GluuFormFooter = ({
  showBack,
  backButtonLabel,
  onBack,
  disableBack = false,
  showCancel,
  cancelButtonLabel,
  onCancel,
  disableCancel,
  showApply,
  onApply,
  disableApply,
  applyButtonType = 'submit',
  applyButtonLabel,
  isLoading = false,
  className = '',
  hideDivider = false,
}: GluuFormFooterProps) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const isDark = state.theme === THEME_DARK
  const { navigateToRoute } = useAppNavigation()

  const buttonStates = useMemo(() => {
    const hasAnyButton = Boolean(showBack) || Boolean(showCancel) || Boolean(showApply)
    const hasThreeButtons = Boolean(showBack) && Boolean(showCancel) && Boolean(showApply)
    const hasRightGroup = hasThreeButtons || (!!showCancel && !showApply)

    return {
      showBack: Boolean(showBack),
      showCancel: Boolean(showCancel),
      showApply: Boolean(showApply),
      hasAnyButton,
      hasThreeButtons,
      hasRightGroup,
    }
  }, [showBack, showCancel, showApply])

  const { classes } = useStyles({ hasRightGroup: buttonStates.hasRightGroup })
  const buttonColors = useMemo(() => getButtonColors(isDark), [isDark])

  const handleBackClick = useCallback(() => {
    if (onBack) {
      onBack()
      return
    }
    navigateToRoute(ROUTES.HOME_DASHBOARD)
  }, [onBack, navigateToRoute])

  const handleCancelClick = useCallback(() => {
    if (onCancel) {
      onCancel()
    }
  }, [onCancel])

  const backLabel = useMemo(() => backButtonLabel || t('actions.back'), [backButtonLabel, t])
  const cancelLabel = useMemo(
    () => cancelButtonLabel || t('actions.cancel'),
    [cancelButtonLabel, t],
  )
  const applyLabel = useMemo(() => applyButtonLabel || t('actions.apply'), [applyButtonLabel, t])

  if (!buttonStates.hasAnyButton) {
    return null
  }

  return (
    <>
      {!hideDivider && <Divider />}
      <Box className={`${classes.footerWrapper} ${className}`} sx={{ my: 2 }}>
        <Box className={classes.leftGroup}>
          {buttonStates.showBack && (
            <GluuButton
              type="button"
              onClick={handleBackClick}
              disabled={disableBack}
              title={backLabel}
              backgroundColor={buttonColors.back.backgroundColor}
              textColor={buttonColors.back.textColor}
              borderColor={buttonColors.back.borderColor}
              {...SHARED_BUTTON_PROPS}
            >
              {backLabel}
            </GluuButton>
          )}

          {!buttonStates.hasThreeButtons && buttonStates.showApply && (
            <GluuButton
              type={applyButtonType}
              onClick={applyButtonType === 'button' ? onApply : undefined}
              disabled={disableApply || isLoading}
              loading={isLoading}
              title={applyLabel}
              backgroundColor={buttonColors.apply.backgroundColor}
              textColor={buttonColors.apply.textColor}
              borderColor={buttonColors.apply.borderColor}
              {...SHARED_BUTTON_PROPS}
            >
              {applyLabel}
            </GluuButton>
          )}
        </Box>

        {buttonStates.hasRightGroup && (
          <Box className={classes.rightGroup}>
            {buttonStates.hasThreeButtons && buttonStates.showApply && (
              <GluuButton
                type={applyButtonType}
                onClick={applyButtonType === 'button' ? onApply : undefined}
                disabled={disableApply || isLoading}
                loading={isLoading}
                title={applyLabel}
                backgroundColor={buttonColors.apply.backgroundColor}
                textColor={buttonColors.apply.textColor}
                borderColor={buttonColors.apply.borderColor}
                {...SHARED_BUTTON_PROPS}
              >
                {applyLabel}
              </GluuButton>
            )}

            {buttonStates.showCancel && (
              <GluuButton
                type="button"
                onClick={handleCancelClick}
                disabled={disableCancel || isLoading}
                title={cancelLabel}
                backgroundColor={buttonColors.cancel.backgroundColor}
                textColor={buttonColors.cancel.textColor}
                borderColor={buttonColors.cancel.borderColor}
                outlined={buttonColors.cancel.outlined}
                {...SHARED_BUTTON_PROPS}
              >
                {cancelLabel}
              </GluuButton>
            )}
          </Box>
        )}
      </Box>
    </>
  )
}

const GluuFormFooterMemoized = memo(GluuFormFooter)
GluuFormFooterMemoized.displayName = 'GluuFormFooter'

export default GluuFormFooterMemoized
