import React from 'react'
import { Col, Button, FormGroup, Divider } from './../../../components'
import { useTranslation } from 'react-i18next'

function GluuFooter({ extraOnClick, extraLabel, hideButtons }) {
  const { t } = useTranslation()

  function goBack() {
    window.history.back()
  }
  return (
    <div>
      <Divider></Divider>
      <FormGroup row></FormGroup>
      <FormGroup row>
        <Col sm={0} md={7}>
          {extraLabel && extraOnClick && (
            <Button color="primary" onClick={extraOnClick}>
              {extraLabel}
            </Button>
          )}
        </Col>
        {!hideButtons || !hideButtons['save'] ? (
          <Col sm={2} md={1}>
            <Button color="primary" type="submit">
              {t('actions.save')}
            </Button>
          </Col>
        ) : (
          ''
        )}
        &nbsp;
        {!hideButtons || !hideButtons['back'] ? (
          <Col sm={2} md={1}>
            <Button color="secondary" onClick={goBack}>
              {t('actions.cancel')}
            </Button>
          </Col>
        ) : (
          ''
        )}
      </FormGroup>
    </div>
  )
}

export default GluuFooter
