import React from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { ROLES } from 'Utils/ApiResources'
import customColors from '@/customColors'

function UiRoleDetailPage({ row }) {
  const { rowData } = row
  return (
    <React.Fragment>
      <Container style={{ backgroundColor: customColors.whiteSmoke }}>
        <Row>
          <Col sm={3}>
            <GluuFormDetailRow
              label="fields.name"
              value={rowData.role}
              isBadge={true}
              doc_category={ROLES}
              doc_entry="name"
            />
          </Col>
          <Col sm={9}>
            <GluuFormDetailRow
              label="fields.description"
              value={rowData.description}
              lsize={3}
              rsize={9}
              doc_category={ROLES}
              doc_entry="description"
            />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default UiRoleDetailPage
