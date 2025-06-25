import React from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { PERMISSIONS } from 'Utils/ApiResources'

interface RowData {
  description?: string
  permission: string
  tag?: string
  defaultPermissionInToken?: boolean
}

interface RowDataWrapper {
  rowData: RowData
}

interface UiPermDetailPageProps {
  row: RowDataWrapper
}

function UiPermDetailPage({ row }: UiPermDetailPageProps) {
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

export default UiPermDetailPage
