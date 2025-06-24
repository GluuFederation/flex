import React from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import PropTypes from 'prop-types'

const ClientActiveTokenDetailPage = ({ row }) => {
  const { rowData } = row
  const DOC_SECTION = 'user'

  return (
    <Container style={{ backgroundColor: '#F5F5F5', minWidth: '100%' }}>
      <Row>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.created_date"
            value={new Date(rowData.creationDate).toLocaleString()}
            doc_category={DOC_SECTION}
            doc_entry="creationDate"
          />
        </Col>

        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.expiration_date"
            value={
              rowData.expirationDate ? new Date(rowData.expirationDate).toLocaleString() : '--'
            }
            doc_category={DOC_SECTION}
            doc_entry="creationDate"
          />
        </Col>

        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.token_type"
            value={rowData.tokenType}
            doc_category={DOC_SECTION}
            doc_entry="token_type"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.scope"
            value={rowData.scope}
            doc_category={DOC_SECTION}
            doc_entry="scope"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.deleteable"
            value={rowData.deletable ? 'true' : 'false'}
            doc_category={DOC_SECTION}
            doc_entry="deleteable"
          />
        </Col>

        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.attributes"
            value={JSON.stringify(rowData.attributes)}
            doc_category={DOC_SECTION}
            doc_entry="deleteable"
          />
        </Col>
      </Row>
    </Container>
  )
}

ClientActiveTokenDetailPage.propTypes = {
  row: PropTypes.any,
}
export default ClientActiveTokenDetailPage
