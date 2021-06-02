import React from 'react'
import { Col, Button, FormGroup, Divider } from './../../../components'

function GluuCommitFooter({
  extraOnClick,
  saveHandler,
  extraLabel,
  hideButtons,
}) {
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
              Cancel
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
            Submit
          </Button>
        </Col>
        {!hideButtons || !hideButtons['save'] ? (
          <Button
            type="button"
            color="primary"
            className="ml-auto px-4"
            onClick={saveHandler}
          >
            Apply
          </Button>
        ) : (
          ''
        )}
      </FormGroup>
    </div>
  )
}

export default GluuCommitFooter
