import React from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { PERMISSIONS } from 'Utils/ApiResources'
import PropTypes from 'prop-types'
import customColors from '@/customColors'

function UiPermDetailPage({ row }) {
  const { rowData } = row
  return (
    <React.Fragment>
      <Container style={{ backgroundColor: customColors.whiteSmoke }}>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.name"
              value={rowData.permission}
              isBadge={true}
              lsize={3}
              rsize={9}
              doc_category={PERMISSIONS}
              doc_entry="name"
            />
          </Col>
          {rowData.tag && (
            <Col sm={6}>
              <GluuFormDetailRow
                label="fields.tag"
                value={rowData.tag}
                lsize={3}
                rsize={9}
                doc_category={PERMISSIONS}
                doc_entry="tag"
              />
            </Col>
          )}
          {rowData.defaultPermissionInToken !== undefined ? (
            <Col sm={6}>
              <GluuFormDetailRow
                label="fields.default_permission_in_token"
                value={
                  rowData.defaultPermissionInToken !== undefined
                    ? JSON.stringify(rowData.defaultPermissionInToken)
                    : null
                }
                lsize={8}
                rsize={4}
                doc_category={PERMISSIONS}
                doc_entry="default_permission_in_token"
              />
            </Col>
          ) : null}
          {rowData.description && (
            <Col sm={6}>
              <GluuFormDetailRow
                label="fields.description"
                value={rowData?.description || '-'}
                lsize={3}
                rsize={9}
                doc_category={PERMISSIONS}
                doc_entry="description"
              />
            </Col>
          )}
        </Row>
      </Container>
    </React.Fragment>
  )
}

UiPermDetailPage.propTypes = {
  row: PropTypes.shape({
    rowData: PropTypes.shape({
      description: PropTypes.string,
      permission: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
      defaultPermissionInToken: PropTypes.bool.isRequired,
    }),
  }),
}

export default UiPermDetailPage
