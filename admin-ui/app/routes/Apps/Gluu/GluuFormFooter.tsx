import { useContext, useMemo, useCallback, memo } from 'react'
import { Button, Divider } from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { Box } from '@mui/material'
import { useAppNavigation } from '@/helpers/navigation'

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
  const selectedTheme = useMemo(() => theme?.state.theme || 'darkBlack', [theme?.state.theme])
  const { navigateToHome } = useAppNavigation()

  const handleBackClick = useCallback(() => {
    if (onBack) {
      onBack()
      return
    }
    navigateToHome()
  }, [onBack, navigateToHome])

  const handleCancelClick = useCallback(() => {
    if (onCancel) {
      onCancel()
    }
  }, [onCancel])

  const buttonStates = useMemo(() => {
    const hasAnyButton = Boolean(showBack) || Boolean(showCancel) || Boolean(showApply)
    const hasAllThreeButtons = Boolean(showBack) && Boolean(showCancel) && Boolean(showApply)
    const hasBackAndCancel = Boolean(showBack) && Boolean(showCancel) && !showApply

    return {
      showBack: Boolean(showBack),
      showCancel: Boolean(showCancel),
      showApply: Boolean(showApply),
      hasAnyButton,
      hasAllThreeButtons,
      hasBackAndCancel,
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

    const layout = {
      back: buttonStates.showBack ? 'd-flex' : '',
      cancel: buttonStates.showCancel ? 'd-flex' : '',
      apply: buttonStates.showApply ? 'd-flex' : '',
    }

    if (buttonStates.showApply) {
      layout.apply += ' ms-auto'
      if (buttonStates.hasAllThreeButtons) {
        layout.apply += ' me-0'
      }
    } else if (buttonStates.showCancel) {
      layout.cancel += ' ms-auto'
    }

    return layout
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
            <ButtonLabel isLoading={false} iconClass="fa fa-arrow-circle-left" label={backLabel} />
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
