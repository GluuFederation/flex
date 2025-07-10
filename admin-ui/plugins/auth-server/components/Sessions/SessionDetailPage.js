import React from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import PropTypes from 'prop-types'
import customColors from '@/customColors'

function SessionDetailPage({ row }) {
  const DOC_CATEGORY = 'sessions'

  return (
    <Container style={{ backgroundColor: customColors.whiteSmoke, minWidth: '100%' }}>
      <Row>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.expiration"
            value={row.expirationDate?.toDateString() ?? '-'}
            doc_category={DOC_CATEGORY}
            doc_entry="expirationDate"
          />
        </Col>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.jans_id"
            value={row.userDn ? row.userDn.split(',')[0].split('=')[1] : '-'}
            doc_category={DOC_CATEGORY}
            doc_entry="jansId"
          />
        </Col>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.jans_state"
            value={row.state ?? '-'}
            doc_category={DOC_CATEGORY}
            doc_entry="jansState"
          />
        </Col>
      </Row>

      <Row>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.jans_sess_state"
            value={row.sessionState ?? '-'}
            doc_category={DOC_CATEGORY}
            doc_entry="jansSessState"
          />
        </Col>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.jans_user_dn"
            value={row.userDn ?? '-'}
            doc_category={DOC_CATEGORY}
            doc_entry="jansUsrDN"
          />
        </Col>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.permission_granted_map"
            value={row.permissionGrantedMap ? JSON.stringify(row.permissionGrantedMap) : '-'}
            doc_category={DOC_CATEGORY}
            doc_entry="permissionGrantedMap"
          />
        </Col>
      </Row>

      <Row>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.jans_sess_attr"
            value={row.sessionAttributes ? JSON.stringify(row.sessionAttributes) : '-'}
            doc_category={DOC_CATEGORY}
            doc_entry="jansSessAttr"
          />
        </Col>
      </Row>
    </Container>
  )
}

SessionDetailPage.propTypes = {
  row: PropTypes.any,
}
export default SessionDetailPage
