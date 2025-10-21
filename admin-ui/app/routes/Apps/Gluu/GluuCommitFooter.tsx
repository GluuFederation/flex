import React, { useContext } from 'react'
import { Button, Divider } from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { Box } from '@mui/material'

interface GluuCommitFooterProps {
  extraOnClick?: () => void
  saveHandler?: () => void
  extraLabel?: string
  hideButtons?: {
    save?: boolean
    back?: boolean
  }
  type?: 'button' | 'submit'
  disableBackButton?: boolean
  cancelHandler?: () => void
}

function GluuCommitFooter({
  extraOnClick,
  saveHandler,
  extraLabel,
  hideButtons,
  type = 'button',
<<<<<<< HEAD
  backButtonLabel,
  backButtonHandler,
  disableBackButton,
}: any) {
=======
  disableBackButton = false,
  cancelHandler = () => {},
}: GluuCommitFooterProps) {
>>>>>>> e34cf7a541918589362c0e3fdedafd95a1a681fb
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || 'darkBlack'

  function goBack() {
    if (backButtonHandler) {
      backButtonHandler()
    } else {
      window.history.back()
    }
  }

  return (
    <>
      <Divider></Divider>
      <Box display="flex" my={2} justifyContent="space-between" alignItems="center" gap={1}>
        {(!hideButtons || !hideButtons['back']) && (
          <Button
            color={`primary-${selectedTheme}`}
            style={{ ...applicationStyle.buttonStyle, ...applicationStyle.buttonFlexIconStyles }}
            type="button"
            onClick={disableBackButton ? cancelHandler : goBack}
            className="d-flex m-1 mx-5"
          >
            {!disableBackButton && <i className="fa fa-arrow-circle-left me-2"></i>}
<<<<<<< HEAD
            {backButtonLabel || t('actions.cancel')}
=======
            {t('actions.cancel')}
>>>>>>> e34cf7a541918589362c0e3fdedafd95a1a681fb
          </Button>
        )}
        {extraLabel && extraOnClick && (
          <Button
            color={`primary-${selectedTheme}`}
            type="button"
            style={applicationStyle.buttonStyle}
            onClick={extraOnClick}
          >
            {extraLabel}
          </Button>
        )}
        <Button
          type="submit"
          color={`primary-${selectedTheme}`}
          className="UserActionSubmitButton"
          style={{ visibility: 'hidden' }}
        >
          {t('actions.submit')}
        </Button>

        {type === 'submit' && (
          <Button
            type="submit"
            color={`primary-${selectedTheme}`}
            style={{ ...applicationStyle.buttonStyle, ...applicationStyle.buttonFlexIconStyles }}
            className="ms-auto px-4"
          >
            <i className="fa fa-check-circle me-2"></i>
            {t('actions.apply')}
          </Button>
        )}

        {!hideButtons || !hideButtons['save'] ? (
          <Button
            type="button"
            color={`primary-${selectedTheme}`}
            style={{ ...applicationStyle.buttonStyle, ...applicationStyle.buttonFlexIconStyles }}
            className="ms-auto px-4"
            onClick={saveHandler}
          >
            <i className="fa fa-check-circle me-2"></i>
            {t('actions.apply')}
          </Button>
        ) : null}
      </Box>
    </>
  )
}

export default GluuCommitFooter
