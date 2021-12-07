import React from 'react'
import { Container, Row, Col } from '../../../../app/components'
import GluuFormDetailRow from '../../../../app/routes/Apps/Gluu/GluuFormDetailRow'

function UiPermDetailPage({ row }) {
  return (
    <React.Fragment>
      <Container style={{ backgroundColor: '#F5F5F5' }}>
        <Row>
          <Col sm={3}>
            <GluuFormDetailRow
              label="fields.name"
              value={row.name}
              isBadge={true}
            />
          </Col>
          <Col sm={9}>
            <GluuFormDetailRow
              label="fields.description"
              value={row.description}
              lsize={3}
              rsize={9}
            />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default UiPermDetailPage
