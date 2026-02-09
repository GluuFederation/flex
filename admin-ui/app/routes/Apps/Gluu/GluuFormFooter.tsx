import { useContext, useMemo, useCallback, memo } from 'react'
import { Button, Divider } from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME } from '@/context/theme/constants'
import clsx from 'clsx'
import { Box } from '@mui/material'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

interface ButtonLabelProps {
  isLoading: boolean
  iconClass: string
  label: string
  loadingIconClass?: string
}

interface GluuFormFooterBaseProps {
  showBack?: boolean
  backButtonLabel?: string
  onBack?: () => void
  disableBack?: boolean
  backIconClass?: string
  showCancel?: boolean
  cancelButtonLabel?: string
  onCancel?: () => void
  disableCancel?: boolean
  showApply?: boolean
  disableApply?: boolean
  applyButtonLabel?: string
  isLoading?: boolean
  className?: string
}

type GluuFormFooterProps = GluuFormFooterBaseProps &
  (
    | { applyButtonType?: 'submit'; onApply?: () => void }
    | { applyButtonType: 'button'; onApply: () => void }
  )

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
  showApply,
  onApply,
  disableApply,
  applyButtonType = 'submit',
  applyButtonLabel,
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
                style={BUTTON_STYLE}
                disabled={disableApply || isLoading}
                aria-label={applyLabel}
              >
                <ButtonLabel
                  isLoading={isLoading}
                  iconClass="fa fa-check-circle"
                  label={applyLabel}
                />
              </Button>
            ) : (
              <Button
                type="button"
                color={buttonColor}
                style={BUTTON_STYLE}
                onClick={onApply}
                disabled={disableApply || isLoading}
                aria-label={applyLabel}
              >
                <ButtonLabel
                  isLoading={isLoading}
                  iconClass="fa fa-check-circle"
                  label={applyLabel}
                />
              </Button>
            )}
          </Box>
        )}

        {buttonStates.showCancel && (
          <Button
            color={buttonColor}
            style={BUTTON_STYLE}
            type="button"
            onClick={handleCancelClick}
            className={`${buttonLayout.cancel}${buttonStates.hasAllThreeButtons ? ' ms-4' : ''}`}
            disabled={disableCancel || isLoading}
            aria-label={cancelLabel}
          >
            <ButtonLabel isLoading={false} iconClass="fa fa-undo" label={cancelLabel} />
          </Button>
        )}
      </Box>
    </>
  )
}

const GluuFormFooterMemoized = memo(GluuFormFooter)
GluuFormFooterMemoized.displayName = 'GluuFormFooter'

export default GluuFormFooterMemoized
