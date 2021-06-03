import React from 'react'
import { Col, Button, FormGroup, Divider } from './../../../components'
function GluuFooter({ 
  extraOnClick, 
  saveHandler,
  extraLabel, 
  hideButtons }) {
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
          <Button color="primary" type="submit" className="LdapUserActionSubmitButton" style={{ visibility: 'hidden' }}>
            Submit
          </Button>
        </Col>
        {!hideButtons || !hideButtons['save'] ? (
          <Col sm={2} md={1}>
            <Button 
              color="primary" 
              type="button"
              onClick={saveHandler}>
              Save
            </Button>
          </Col>
        ) : (
          ''
        )}
        &nbsp;
        {!hideButtons || !hideButtons['back'] ? (
          <Col sm={2} md={1}>
            <Button color="secondary" onClick={goBack}>
              Cancel
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
