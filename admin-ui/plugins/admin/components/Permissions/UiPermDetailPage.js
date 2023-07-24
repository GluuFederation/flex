import React from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { PERMISSIONS } from 'Utils/ApiResources'

function UiPermDetailPage({ row }) {
  const { rowData } = row
  return (
    <React.Fragment>
      <Container style={{ backgroundColor: '#F5F5F5' }}>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.name"
              value={rowData.permission}
              isBadge={true}
              lsize={3}
              rsize={9}
              doc_category={PERMISSIONS}
              doc_entry='name'
            />
          </Col>
          {rowData.description && (
            <Col sm={6}>
              <GluuFormDetailRow
                label="fields.description"
                value={rowData.description}
                lsize={3}
                rsize={9}
                doc_category={PERMISSIONS}
                doc_entry='description'
              />
            </Col>
          )}
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default UiPermDetailPage
