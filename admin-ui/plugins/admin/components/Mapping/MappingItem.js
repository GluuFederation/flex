import React, { useState } from 'react'
import {
  Row,
  Badge,
  Col,
  Button,
  FormGroup,
  Accordion,
} from '../../../../app/components'

function MappingItem({ candidate, key }) {
  const [item, setItem] = useState(candidate || {})
  function doRemove(perm) {
    const candidate = item
    candidate['permissions'] = ['one', 'two']
    setItem(candidate)
  }
  return (
    <div key={key}>
      <FormGroup row />
      <Row>
        <Col sm={12}>
          <Accordion className="mb-12">
            <Accordion.Header className="text-info">
              <Accordion.Indicator className="mr-2" />
              {item.role}
              <Badge
                color="info"
                style={{
                  float: 'right',
                }}
              >
                {item.permissions.length}
              </Badge>
            </Accordion.Header>
            <Accordion.Body>
              {item.permissions.map((permission, id) => (
                <Row key={id}>
                  <Col sm={10}>{permission}</Col>
                  <Col sm={2}>
                    <Button
                      type="button"
                      color="danger"
                      onClick={() => doRemove(permission)}
                      style={{ margin: '1px', float: 'right', padding: '0px' }}
                    >
                      <i className="fa fa-trash mr-2"></i>
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
            </Accordion.Body>
          </Accordion>
        </Col>
        <FormGroup row />
      </Row>
    </div>
  )
}

export default MappingItem
