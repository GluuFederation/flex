import { useContext, useMemo, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Divider } from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { Box } from '@mui/material'

interface GluuCommitFooterProps {
  showBack?: boolean
  backButtonLabel?: string
  backButtonHandler?: () => void
  onBack?: () => void
  disableBack?: boolean
  showCancel?: boolean
  cancelButtonLabel?: string
  cancelHandler?: () => void
  onCancel?: () => void
  disableCancel?: boolean
  showApply?: boolean
  applyHandler?: () => void
  onApply?: () => void
  disableApply?: boolean
  applyButtonType?: 'button' | 'submit'
  extraOnClick?: () => void
  extraLabel?: string
  saveHandler?: () => void
  hideButtons?: {
    save?: boolean
    back?: boolean
  }
  disableButtons?: {
    save?: boolean
    back?: boolean
  }
  type?: 'button' | 'submit'
  disableBackButton?: boolean
  isLoading?: boolean
  className?: string
}

const GluuCommitFooter = memo(function GluuCommitFooter({
  showBack,
  backButtonLabel,
  backButtonHandler,
  onBack,
  disableBack,
  showCancel,
  cancelButtonLabel,
  cancelHandler: newCancelHandler,
  onCancel,
  disableCancel,
  showApply,
  applyHandler,
  onApply,
  disableApply,
  applyButtonType = 'submit',
  extraOnClick,
  saveHandler,
  extraLabel,
  hideButtons,
  disableButtons,
  type = 'button',
  disableBackButton = false,
  cancelHandler: legacyCancelHandler,
  isLoading = false,
  className = '',
}: GluuCommitFooterProps) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = useMemo(() => theme?.state.theme || 'darkBlack', [theme?.state.theme])
  const navigate = useNavigate()

  const isNewApiUsed = useMemo(
    () => showBack !== undefined || showCancel !== undefined || showApply !== undefined,
    [showBack, showCancel, showApply],
  )

  const finalShowBack = useMemo(() => {
    return isNewApiUsed ? showBack : !hideButtons || !hideButtons.back
  }, [isNewApiUsed, showBack, hideButtons])

  const finalShowCancel = useMemo(() => {
    return isNewApiUsed ? showCancel : false
  }, [isNewApiUsed, showCancel])

  const finalShowApply = useMemo(() => {
    return isNewApiUsed ? showApply : !hideButtons || !hideButtons.save
  }, [isNewApiUsed, showApply, hideButtons])

  const finalBackHandler = useMemo(() => backButtonHandler || onBack, [backButtonHandler, onBack])
  const finalCancelHandler = useMemo(
    () => newCancelHandler || legacyCancelHandler || onCancel,
    [newCancelHandler, legacyCancelHandler, onCancel],
  )
  const finalApplyHandler = useMemo(
    () => applyHandler || onApply || saveHandler,
    [applyHandler, onApply, saveHandler],
  )
  const finalButtonType = useMemo(() => applyButtonType || type, [applyButtonType, type])
  const finalDisableBack = useMemo(
    () => disableBack || disableButtons?.back,
    [disableBack, disableButtons?.back],
  )
  const finalDisableCancel = useMemo(() => disableCancel, [disableCancel])
  const finalDisableApply = useMemo(
    () => disableApply || disableButtons?.save,
    [disableApply, disableButtons?.save],
  )

  const handleBackClick = useCallback(() => {
    if (disableBackButton && finalCancelHandler) {
      finalCancelHandler()
    } else if (finalBackHandler) {
      finalBackHandler()
    } else {
      navigate('/home/dashboard')
    }
  }, [disableBackButton, finalCancelHandler, finalBackHandler, navigate])

  const handleCancelClick = useCallback(() => {
    if (finalCancelHandler) {
      finalCancelHandler()
    }
  }, [finalCancelHandler])

  const buttonStates = useMemo(() => {
    const showExtra = Boolean(extraLabel && extraOnClick)
    const hasAnyButton = finalShowBack || finalShowCancel || finalShowApply || showExtra
    const hasAllThreeButtons = finalShowBack && finalShowCancel && finalShowApply
    const hasBackAndCancel = finalShowBack && finalShowCancel && !finalShowApply

    return {
      showBack: finalShowBack,
      showCancel: finalShowCancel,
      showApply: finalShowApply,
      showExtra,
      hasAnyButton,
      hasAllThreeButtons,
      hasBackAndCancel,
    }
  }, [finalShowBack, finalShowCancel, finalShowApply, extraLabel, extraOnClick])

  const buttonStyle = useMemo(
    () => ({ ...applicationStyle.buttonStyle, ...applicationStyle.buttonFlexIconStyles }),
    [],
  )

  const extraButtonStyle = useMemo(() => applicationStyle.buttonStyle, [])
  const hiddenButtonStyle = useMemo(() => ({ visibility: 'hidden' as const }), [])
  const buttonColor = useMemo(() => `primary-${selectedTheme}`, [selectedTheme])

  const backLabel = useMemo(() => backButtonLabel || t('actions.back'), [backButtonLabel, t])
  const cancelLabel = useMemo(
    () => cancelButtonLabel || t('actions.cancel'),
    [cancelButtonLabel, t],
  )
  const applyLabel = useMemo(() => t('actions.apply'), [t])
  const submitLabel = useMemo(() => t('actions.submit'), [t])

  const buttonLayout = useMemo(() => {
    if (buttonStates.hasAllThreeButtons) {
      return {
        back: 'd-flex',
        cancel: 'd-flex',
        apply: 'd-flex ms-auto',
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
    return {
      back: 'd-flex',
      cancel: 'd-flex',
      apply: 'd-flex ms-auto',
    }
  }, [buttonStates, finalShowBack, finalShowCancel, finalShowApply])

  const actualDisableBack = useMemo(() => {
    if (finalShowBack) {
      return false
    }
    return finalDisableBack
  }, [finalShowBack, finalDisableBack])

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
            disabled={actualDisableBack || isLoading}
          >
            {isLoading ? (
              <>
                <i className="fa fa-spinner fa-spin me-2" />
                {backLabel}
              </>
            ) : (
              <>
                <i className="fa fa-arrow-circle-left me-2" />
                {backLabel}
              </>
            )}
          </Button>
        )}

        {buttonStates.showCancel && (
          <Box
            display="flex"
            flex={buttonStates.hasAllThreeButtons ? 1 : 0}
            justifyContent="center"
          >
            <Button
              color={buttonColor}
              style={buttonStyle}
              type="button"
              onClick={handleCancelClick}
              className="d-flex"
              disabled={finalDisableCancel || isLoading}
            >
              <>
                <i className={`${isLoading ? 'fa fa-spinner fa-spin me-2' : 'fa fa-undo me-2'}`} />
                {cancelLabel}
              </>
            </Button>
          </Box>
        )}

        {buttonStates.showExtra && (
          <Button
            color={buttonColor}
            type="button"
            style={extraButtonStyle}
            onClick={extraOnClick}
            disabled={isLoading}
          >
            {extraLabel}
          </Button>
        )}

        <Button
          type="submit"
          color={buttonColor}
          className="UserActionSubmitButton"
          style={hiddenButtonStyle}
        >
          {submitLabel}
        </Button>

        {buttonStates.showApply && finalButtonType === 'submit' && (
          <Button
            type="submit"
            color={buttonColor}
            style={buttonStyle}
            className={buttonLayout.apply}
            disabled={finalDisableApply || isLoading}
          >
            {isLoading ? (
              <>
                <i className="fa fa-spinner fa-spin me-2" />
                {applyLabel}
              </>
            ) : (
              <>
                <i className="fa fa-check-circle me-2" />
                {applyLabel}
              </>
            )}
          </Button>
        )}

        {buttonStates.showApply && finalButtonType === 'button' && (
          <Button
            type="button"
            color={buttonColor}
            style={buttonStyle}
            className={buttonLayout.apply}
            onClick={finalApplyHandler}
            disabled={finalDisableApply || isLoading}
          >
            {isLoading ? (
              <>
                <i className="fa fa-spinner fa-spin me-2" />
                {applyLabel}
              </>
            ) : (
              <>
                <i className="fa fa-check-circle me-2" />
                {applyLabel}
              </>
            )}
          </Button>
        )}
      </Box>
    </>
  )
})

export default GluuCommitFooter
