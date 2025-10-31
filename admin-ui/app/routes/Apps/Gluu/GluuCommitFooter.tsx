import { useContext, useMemo, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Divider } from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { Box } from '@mui/material'
// Local props for the label renderer used by buttons
interface ButtonLabelProps {
  isLoading: boolean
  iconClass: string
  label: string
  loadingIconClass?: string
}

interface GluuCommitFooterProps {
  showBack?: boolean
  backButtonLabel?: string
  onBack?: () => void
  disableBack?: boolean
  showCancel?: boolean
  cancelButtonLabel?: string
  onCancel?: () => void
  disableCancel?: boolean
  showApply?: boolean
  onApply?: () => void
  disableApply?: boolean
  applyButtonType?: 'button' | 'submit'
  isLoading?: boolean
  className?: string
}

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

const GluuCommitFooter = ({
  showBack,
  backButtonLabel,
  onBack,
  disableBack,
  showCancel,
  cancelButtonLabel,
  onCancel,
  disableCancel,
  showApply,
  onApply,
  disableApply,
  applyButtonType = 'submit',
  isLoading = false,
  className = '',
}: GluuCommitFooterProps) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = useMemo(() => theme?.state.theme || 'darkBlack', [theme?.state.theme])
  const navigate = useNavigate()

  const handleBackClick = useCallback(() => {
    if (onBack) {
      onBack()
      return
    }
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/home/dashboard')
    }
  }, [onBack, navigate])

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
  const applyLabel = useMemo(() => t('actions.apply'), [t])

  const buttonLayout = useMemo(() => {
    if (buttonStates.hasAllThreeButtons) {
      return {
        back: 'd-flex',
        cancel: 'd-flex',
        apply: 'd-flex ms-auto me-0',
      }
    }
    if (buttonStates.hasBackAndCancel) {
      return {
        back: 'd-flex',
        cancel: 'd-flex ms-auto',
        apply: '',
      }
    }
    if (buttonStates.showBack && !buttonStates.showCancel && !buttonStates.showApply) {
      return {
        back: 'd-flex',
        cancel: '',
        apply: '',
      }
    }
    if (buttonStates.showCancel && !buttonStates.showBack && !buttonStates.showApply) {
      return {
        back: '',
        cancel: 'd-flex',
        apply: '',
      }
    }
    if (buttonStates.showBack && buttonStates.showApply && !buttonStates.showCancel) {
      return {
        back: 'd-flex',
        cancel: '',
        apply: 'd-flex ms-auto',
      }
    }
    if (buttonStates.showCancel && buttonStates.showApply && !buttonStates.showBack) {
      return {
        back: '',
        cancel: 'd-flex',
        apply: 'd-flex ms-auto',
      }
    }
    if (buttonStates.showApply && !buttonStates.showBack && !buttonStates.showCancel) {
      return {
        back: '',
        cancel: '',
        apply: 'd-flex ms-auto',
      }
    }
    throw new Error('Unhandled button layout state')
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
            disabled={disableBack || isLoading}
          >
            <ButtonLabel
              isLoading={isLoading}
              iconClass="fa fa-arrow-circle-left"
              label={backLabel}
            />
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
                disabled={disableApply || isLoading || !onApply}
              >
                <ButtonLabel
                  isLoading={isLoading}
                  iconClass="fa fa-check-circle"
                  label={applyLabel}
                />
              </Button>
            )}
            {buttonStates.hasAllThreeButtons && (
              <Button
                color={buttonColor}
                style={BUTTON_STYLE}
                type="button"
                onClick={handleCancelClick}
                className={`${buttonLayout.cancel} ms-4`}
                disabled={disableCancel || isLoading}
              >
                <ButtonLabel isLoading={isLoading} iconClass="fa fa-undo" label={cancelLabel} />
              </Button>
            )}
          </Box>
        )}

        {!buttonStates.hasAllThreeButtons && buttonStates.showCancel && (
          <Button
            color={buttonColor}
            style={BUTTON_STYLE}
            type="button"
            onClick={handleCancelClick}
            className={buttonLayout.cancel}
            disabled={disableCancel || isLoading}
          >
            <ButtonLabel isLoading={isLoading} iconClass="fa fa-undo" label={cancelLabel} />
          </Button>
        )}
      </Box>
    </>
  )
}

const GluuCommitFooterMemoized = memo(GluuCommitFooter)
GluuCommitFooterMemoized.displayName = 'GluuCommitFooter'

export default GluuCommitFooterMemoized
