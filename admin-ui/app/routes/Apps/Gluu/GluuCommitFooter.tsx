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

  const finalShowBack = Boolean(showBack)
  const finalShowCancel = Boolean(showCancel)
  const finalShowApply = Boolean(showApply)

  const finalBackHandler = onBack
  const finalCancelHandler = onCancel
  const finalApplyHandler = onApply
  const finalButtonType = applyButtonType
  const finalDisableBack = disableBack
  const finalDisableCancel = disableCancel
  const finalDisableApply = disableApply

  const handleBackClick = useCallback(() => {
    if (finalBackHandler) {
      finalBackHandler()
      return
    }
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/home/dashboard')
    }
  }, [finalBackHandler, navigate])

  const handleCancelClick = useCallback(() => {
    if (finalCancelHandler) {
      finalCancelHandler()
    }
  }, [finalCancelHandler])

  const buttonStates = useMemo(() => {
    const hasAnyButton = finalShowBack || finalShowCancel || finalShowApply
    const hasAllThreeButtons = finalShowBack && finalShowCancel && finalShowApply
    const hasBackAndCancel = finalShowBack && finalShowCancel && !finalShowApply

    return {
      showBack: finalShowBack,
      showCancel: finalShowCancel,
      showApply: finalShowApply,
      hasAnyButton,
      hasAllThreeButtons,
      hasBackAndCancel,
    }
  }, [finalShowBack, finalShowCancel, finalShowApply])

  const buttonStyle = useMemo(
    () => ({ ...applicationStyle.buttonStyle, ...applicationStyle.buttonFlexIconStyles }),
    [],
  )

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
    if (finalShowBack && !finalShowCancel && !finalShowApply) {
      return {
        back: 'd-flex',
        cancel: '',
        apply: '',
      }
    }
    if (finalShowCancel && !finalShowBack && !finalShowApply) {
      return {
        back: '',
        cancel: 'd-flex',
        apply: '',
      }
    }
    if (finalShowBack && finalShowApply && !finalShowCancel) {
      return {
        back: 'd-flex',
        cancel: '',
        apply: 'd-flex ms-auto',
      }
    }
    if (finalShowCancel && finalShowApply && !finalShowBack) {
      return {
        back: '',
        cancel: 'd-flex',
        apply: 'd-flex ms-auto',
      }
    }
    if (finalShowApply && !finalShowBack && !finalShowCancel) {
      return {
        back: '',
        cancel: '',
        apply: 'd-flex ms-auto',
      }
    }
    throw new Error('Unhandled button layout state')
  }, [buttonStates, finalShowBack, finalShowCancel, finalShowApply])

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
            style={buttonStyle}
            type="button"
            onClick={handleBackClick}
            className={buttonLayout.back}
            disabled={finalDisableBack || isLoading}
          >
            <ButtonLabel
              isLoading={isLoading}
              iconClass="fa fa-arrow-circle-left"
              label={backLabel}
            />
          </Button>
        )}

        {buttonStates.showApply && (
          <Box display="flex" className={buttonLayout.apply}>
            {finalButtonType === 'submit' ? (
              <Button
                type="submit"
                color={buttonColor}
                style={buttonStyle}
                className="d-flex"
                disabled={finalDisableApply || isLoading}
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
                style={buttonStyle}
                className="d-flex"
                onClick={finalApplyHandler}
                disabled={finalDisableApply || isLoading}
              >
                <ButtonLabel
                  isLoading={isLoading}
                  iconClass="fa fa-check-circle"
                  label={applyLabel}
                />
              </Button>
            )}
            {buttonStates.hasAllThreeButtons && buttonStates.showCancel && (
              <Button
                color={buttonColor}
                style={buttonStyle}
                type="button"
                onClick={handleCancelClick}
                className="d-flex ms-4"
                disabled={finalDisableCancel || isLoading}
              >
                <ButtonLabel isLoading={isLoading} iconClass="fa fa-undo" label={cancelLabel} />
              </Button>
            )}
          </Box>
        )}

        {!buttonStates.hasAllThreeButtons && buttonStates.showCancel && (
          <Button
            color={buttonColor}
            style={buttonStyle}
            type="button"
            onClick={handleCancelClick}
            className={buttonLayout.cancel}
            disabled={finalDisableCancel || isLoading}
          >
            <ButtonLabel isLoading={isLoading} iconClass="fa fa-undo" label={cancelLabel} />
          </Button>
        )}
      </Box>
    </>
  )
}

export default memo(GluuCommitFooter)
