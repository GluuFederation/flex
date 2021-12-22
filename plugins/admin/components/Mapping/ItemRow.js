import React from 'react'
import { Button, Row, Col, FormGroup } from '../../../../app/components'

function ItemRow({ key, candidate, permission }) {
  function doRemove(item) {
    //confirm('=============' + item)
  }
  return (
    <div key={key}>
      <FormGroup row />
      <Row>
        <Col sm={10}>{permission}</Col>
        <Col sm={2}>
          <Button
            type="button"
            color="danger"
            style={{ margin: '1px', float: 'right', padding: '0px' }}
            onClick={doRemove(permission)}
          >
            <i className="fa fa-trash mr-2"></i>
            Remove
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default ItemRow
