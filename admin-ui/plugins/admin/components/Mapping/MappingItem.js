import React from 'react'
import {
  Row,
  Badge,
  Col,
  Button,
  FormGroup,
  Accordion,
} from '../../../../app/components'
import { useDispatch } from 'react-redux'
import { updateMapping } from '../../redux/actions/MappingActions'

function MappingItem({ candidate }) {
  const dispatch = useDispatch()
  const doRemove = (id, role) => {
    dispatch(
      updateMapping({
        id,
        role,
      }),
    )
  }
  return (
    <div>
      <FormGroup row />
      <Row>
        <Col sm={12}>
          <Accordion className="mb-12">
            <Accordion.Header className="text-info">
              <Accordion.Indicator className="mr-2" />
              {candidate.role}
              <Badge
                color="info"
                style={{
                  float: 'right',
                }}
              >
                {candidate.permissions.length}
              </Badge>
            </Accordion.Header>
            <Accordion.Body>
              {candidate.permissions.map((permission, id) => (
                <Row key={id}>
                  <Col sm={10}>{permission}</Col>
                  <Col sm={2}>
                    <Button
                      type="button"
                      color="danger"
                      onClick={() => doRemove(id, candidate.role)}
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
