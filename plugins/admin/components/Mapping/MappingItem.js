import React from 'react'
import {
  Row,
  Badge,
  Col,
  FormGroup,
  Accordion,
} from '../../../../app/components'
import ItemRow from './ItemRow'

function MappingItem({ candidate, key }) {
  return (
    <div key={key}>
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
              {candidate.permissions.map((perm, id) => (
                <ItemRow key={id} candiadate={candidate} permission={perm}></ItemRow>
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
