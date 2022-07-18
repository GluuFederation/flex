import React, { useContext } from 'react'
import { Col, Button, FormGroup, Divider } from 'Components'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'

function GluuCommitFooter({
  extraOnClick,
  saveHandler,
  extraLabel,
  hideButtons,
}) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  function goBack() {
    window.history.back()
  }
  return (
    <>
      <Divider></Divider>
      <FormGroup row></FormGroup>
      <FormGroup row>
        &nbsp;
        {!hideButtons || !hideButtons['back'] ? (
          <Col sm={2} md={1}>
            <Button
              color={`primary-${selectedTheme}`}
              style={applicationStyle.buttonStyle}
              type="button"
              onClick={goBack}
            >
              <i className="fa fa-arrow-circle-left mr-2"></i>
              {t('actions.cancel')}
            </Button>
          </Col>
        ) : (
          ''
        )}
        <Col sm={0} md={7}>
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
        </Col>
        {!hideButtons || !hideButtons['save'] ? (
          <Button
            type="button"
            color={`primary-${selectedTheme}`}
            style={applicationStyle.buttonStyle}
            className="ml-auto px-4"
            onClick={saveHandler}
          >
            <i className="fa fa-check-circle mr-2"></i>
            {t('actions.apply')}
          </Button>
        ) : (
          ''
        )}
      </FormGroup>
    </>
  )
}

export default GluuCommitFooter
