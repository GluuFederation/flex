import React from 'react'
import { Col, Button, FormGroup, Divider } from './../../../components'
function GluuFooter({ extraOnClick, extraLabel }) {
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
        <Col sm={2} md={1}>
          <Button color="primary" type="submit">
            Save
          </Button>
        </Col>
        &nbsp;
        <Col sm={2} md={1}>
          <Button color="secondary" onClick={goBack}>
            Cancel
          </Button>
        </Col>
      </FormGroup>
    </div>
  )
}

export default GluuFooter
