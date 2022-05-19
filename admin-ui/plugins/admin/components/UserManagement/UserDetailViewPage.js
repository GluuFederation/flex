import React, { useEffect } from 'react'
import { Container, Row, Col } from '../../../../app/components'
import GluuFormDetailRow from '../../../../app/routes/Apps/Gluu/GluuFormDetailRow'
const UserDetailViewPage = ({ row }) => {
  const { rowData } = row
  useEffect(() => {
    console.log(row)
  }, [row])
  return (
    <React.Fragment>
      <Container style={{ backgroundColor: '#F5F5F5' }}>
        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label="fields.name"
              value={rowData.displayName}
            />
          </Col>
          <Col sm={4}>
            <GluuFormDetailRow
              label="fields.givenName"
              value={rowData.givenName}
            />
          </Col>
          <Col sm={4}>
            <GluuFormDetailRow label="fields.userName" value={rowData.userId} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="fields.email" value={rowData?.mail} />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}
export default UserDetailViewPage
