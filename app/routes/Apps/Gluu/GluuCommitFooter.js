import React from 'react'
import { Col, Button, FormGroup, Divider } from './../../../components'
import { useTranslation } from 'react-i18next'

function GluuCommitFooter({
  extraOnClick,
  saveHandler,
  extraLabel,
  hideButtons,
}) {
  const { t } = useTranslation()
  function goBack() {
    window.history.back()
  }
  return (
    <div>
      <Divider></Divider>
      <FormGroup row></FormGroup>
      <FormGroup row>
        &nbsp;
        {!hideButtons || !hideButtons['back'] ? (
          <Col sm={2} md={1}>
            <Button color="secondary" type="button" onClick={goBack}>
              {t("Cancel")}
            </Button>
          </Col>
        ) : (
          ''
        )}
        <Col sm={0} md={7}>
          {extraLabel && extraOnClick && (
            <Button color="primary" type="button" onClick={extraOnClick}>
              {extraLabel}
            </Button>
          )}
          <Button
            type="submit"
            color="primary"
            className="UserActionSubmitButton"
            style={{ visibility: 'hidden' }}
          >
            {t("Submit")}
          </Button>
        </Col>
        {!hideButtons || !hideButtons['save'] ? (
          <Button
            type="button"
            color="primary"
            className="ml-auto px-4"
            onClick={saveHandler}
          >
            {t("Apply")}
          </Button>
        ) : (
          ''
        )}
      </FormGroup>
    </div>
  )
}

export default GluuCommitFooter
