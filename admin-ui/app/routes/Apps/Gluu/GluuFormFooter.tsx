import { useContext, useMemo, useCallback, memo } from 'react'
import { Button, Divider } from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from '@/routes/Apps/Gluu/styles/applicationStyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME } from '@/context/theme/constants'
import clsx from 'clsx'
import { Box } from '@mui/material'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { ButtonLabelProps, GluuFormFooterProps } from './types'

const ButtonLabel = memo((props: ButtonLabelProps) => {
  const { isLoading, iconClass, label, loadingIconClass = 'fa fa-spinner fa-spin' } = props
  return (
    <>
      <i className={`${isLoading ? loadingIconClass : iconClass} me-2`} />
      {label}
    </>
  )
})

ButtonLabel.displayName = 'ButtonLabel'

const BUTTON_STYLE = { ...applicationStyle.buttonStyle, ...applicationStyle.buttonFlexIconStyles }

const GluuFormFooter = ({
  showBack,
  backButtonLabel,
  onBack,
  disableBack = false,
  backIconClass = 'fa fa-arrow-circle-left',
  showCancel,
  cancelButtonLabel,
  onCancel,
  disableCancel,
  cancelButtonStyle,
  cancelButtonClassName = '',
  cancelIconClass = 'fa fa-undo',
  showApply,
  onApply,
  disableApply,
  applyButtonType = 'submit',
  applyButtonLabel,
  applyButtonStyle,
  applyButtonClassName = '',
  applyIconClass = 'fa fa-check-circle',
  isLoading = false,
  className = '',
}: GluuFormFooterProps) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = useMemo(() => theme?.state.theme || DEFAULT_THEME, [theme?.state.theme])
  const { navigateToRoute } = useAppNavigation()

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

  const buttonStates = useMemo(() => {
    const hasAnyButton = Boolean(showBack) || Boolean(showCancel) || Boolean(showApply)
    const hasAllThreeButtons = Boolean(showBack) && Boolean(showCancel) && Boolean(showApply)

    return {
      showBack: Boolean(showBack),
      showCancel: Boolean(showCancel),
      showApply: Boolean(showApply),
      hasAnyButton,
      hasAllThreeButtons,
    }
  }, [showBack, showCancel, showApply])

  const buttonColor = useMemo(() => `primary-${selectedTheme}`, [selectedTheme])

  const backLabel = useMemo(() => backButtonLabel || t('actions.back'), [backButtonLabel, t])
  const cancelLabel = useMemo(
    () => cancelButtonLabel || t('actions.cancel'),
    [cancelButtonLabel, t],
  )
  const applyLabel = useMemo(() => applyButtonLabel || t('actions.apply'), [applyButtonLabel, t])

  const buttonLayout = useMemo(() => {
    if (!buttonStates.hasAnyButton) {
      return { back: '', cancel: '', apply: '' }
    }

    const back = clsx(buttonStates.showBack && 'd-flex')

    const apply = clsx(
      buttonStates.showApply && 'd-flex',
      buttonStates.showApply && 'ms-auto',
      buttonStates.showApply && buttonStates.hasAllThreeButtons && 'me-0',
    )

    const cancel = clsx(
      buttonStates.showCancel && 'd-flex',
      !buttonStates.showApply && buttonStates.showCancel && 'ms-auto',
    )

    return { back, cancel, apply }
  }, [buttonStates])

  if (!buttonStates.hasAnyButton) {
    return null
  }

  return (
    <>
      <Divider />
      <Box
        display="flex"
        my={2}
        justifyContent="space-between"
        alignItems="center"
        gap={1}
        className={className}
      >
        {buttonStates.showBack && (
          <Button
            color={buttonColor}
            style={BUTTON_STYLE}
            type="button"
            onClick={handleBackClick}
            className={buttonLayout.back}
            disabled={disableBack}
            aria-label={backLabel}
          >
            <ButtonLabel isLoading={false} iconClass={backIconClass} label={backLabel} />
          </Button>
        )}

        {buttonStates.showApply && (
          <Box className={buttonLayout.apply}>
            {applyButtonType === 'submit' ? (
              <Button
                type="submit"
                color={buttonColor}
                style={applyButtonStyle ?? BUTTON_STYLE}
                className={applyButtonClassName}
                disabled={disableApply || isLoading}
                aria-label={applyLabel}
              >
                <ButtonLabel isLoading={isLoading} iconClass={applyIconClass} label={applyLabel} />
              </Button>
            ) : (
              <Button
                type="button"
                color={buttonColor}
                style={applyButtonStyle ?? BUTTON_STYLE}
                className={applyButtonClassName}
                onClick={onApply}
                disabled={disableApply || isLoading}
                aria-label={applyLabel}
              >
                <ButtonLabel isLoading={isLoading} iconClass={applyIconClass} label={applyLabel} />
              </Button>
            )}
          </Box>
        )}

        {buttonStates.showCancel && (
          <Button
            color={buttonColor}
            style={cancelButtonStyle ?? BUTTON_STYLE}
            className={`${buttonLayout.cancel}${buttonStates.hasAllThreeButtons ? ' ms-4' : ''} ${cancelButtonClassName}`.trim()}
            type="button"
            onClick={handleCancelClick}
            disabled={disableCancel || isLoading}
            aria-label={cancelLabel}
          >
            <ButtonLabel isLoading={false} iconClass={cancelIconClass} label={cancelLabel} />
          </Button>
        )}
      </Box>
    </>
  )
}

const GluuFormFooterMemoized = memo(GluuFormFooter)
GluuFormFooterMemoized.displayName = 'GluuFormFooter'

export default GluuFormFooterMemoized
