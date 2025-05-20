import React, { useState } from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { SSA } from 'Utils/ApiResources'
import GluuFormActionRow from 'Routes/Apps/Gluu/GluuFormActionRow';
import JsonViewerDialog from '../JsonViewer/JsonViewerDialog'

const SsaDetailPage = ({ row }) => {
  const [ssaDialogOpen, setSsaDialogOpen] = useState(false)
  const [ssaData, setSsaData] = useState(row?.ssa?.software_roles)

  const handleSsaDialogOpen = () => {
    setSsaDialogOpen(!ssaDialogOpen)
    setSsaData(row?.ssa?.software_roles)
  }

  return (
    <Container style={{ backgroundColor: '#F5F5F5' }}>
      <Row>
        <Col sm={6}>
          <GluuFormDetailRow
            label='fields.software_id'
            value={row.ssa.software_id}
            doc_category={SSA}
            doc_entry='software_id'
          />
        </Col>
        <Col sm={6}>
          <GluuFormDetailRow
            label='fields.organization'
            value={row.ssa.org_id}
            doc_category={SSA}
            doc_entry='org_id'
          />
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <GluuFormDetailRow
            label='fields.description'
            value={row.ssa.description}
            doc_category={SSA}
            doc_entry='description'
          />
        </Col>
        <Col sm={6}>
          <GluuFormActionRow
            label='fields.software_roles'
            value={row?.ssa?.software_roles}
            doc_category={SSA}
            doc_entry='software_roles'
            rsize={2}
            onActionClick={handleSsaDialogOpen}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <GluuFormDetailRow
            label='fields.status'
            value={row.status}
            doc_category={SSA}
            doc_entry='status'
          />
        </Col>
        <Col sm={6}>
          <GluuFormDetailRow
            label='fields.expiration'
            value={
              row.expiration
                ? new Date(row.expiration).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })
                : 'Never'
            }
            doc_category={SSA}
            doc_entry='expiration'
          />
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <GluuFormDetailRow
            label='fields.one_time_use'
            value={row.ssa?.one_time_use?.toString()}
            doc_category={SSA}
            doc_entry='one_time_use'
            isBadge
          />
        </Col>
        <Col sm={6}>
          <GluuFormDetailRow
            label='fields.grant_types'
            value={row.ssa.grant_types}
            doc_category={SSA}
            doc_entry='grant_types'
            isBadge
          />
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <GluuFormDetailRow
            label='fields.rotate_ssa'
            value={row.ssa?.rotate_ssa?.toString()}
            doc_category={SSA}
            doc_entry='rotate_ssa'
            isBadge
          />
        </Col>
      </Row>
      <JsonViewerDialog
        isOpen={ssaDialogOpen}
        toggle={handleSsaDialogOpen}
        data={ssaData}
        title="JSON View"
        theme="light"
        expanded={true}
      />
    </Container>
  )
}

export default SsaDetailPage
