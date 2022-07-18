import React, { useContext } from 'react'
import { Col, Button, FormGroup, Divider } from 'Components'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'

function GluuFooter({ extraOnClick, extraLabel, hideButtons }) {
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
        <Col sm={4} md={2}>
          {extraLabel && extraOnClick && (
            <Button
              color={`primary-${selectedTheme}`}
              onClick={extraOnClick}
            >
              {t(extraLabel)}
            </Button>
          )}
        </Col>
        {!hideButtons || !hideButtons['back'] ? (
          <Col sm={4} md={2}>
            <Button
              color={`primary-${selectedTheme}`}
              onClick={goBack}
            >
              <i className="fa fa-arrow-circle-left mr-2"></i>
              {t('actions.cancel')}
            </Button>
          </Col>
        ) : (
          ''
        )}
        &nbsp;
        {!hideButtons || !hideButtons['save'] ? (
          <Col sm={4} md={2}>
            <Button
              color={`primary-${selectedTheme}`}
              type="submit"
            >
              <i className="fa fa-check-circle mr-2"></i>
              {t('actions.save')}
            </Button>
          </Col>
        ) : (
          ''
        )}
      </FormGroup>
    </>
  )
}

export default GluuFooter
