import React from 'react'
import { Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import customColors from '@/customColors'
import { UserDeviceDetailViewPageProps } from '../types/ComponentTypes'

const UserDeviceDetailViewPage = ({ row }: UserDeviceDetailViewPageProps) => {
  const { rowData } = row
  const deviceData = rowData
  const DOC_SECTION = 'user'

  return (
    <div style={{ backgroundColor: customColors.whiteSmoke, padding: '16px', width: '100%' }}>
      <Row>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.domain"
            value={deviceData.registrationData?.domain || deviceData.registrationData?.rpId}
            doc_category={DOC_SECTION}
            doc_entry="domain"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.type"
            value={deviceData.registrationData?.type}
            doc_category={DOC_SECTION}
            doc_entry="type"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.status"
            value={deviceData.registrationData?.status}
            doc_category={DOC_SECTION}
            doc_entry="status"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.createdBy"
            value={deviceData.registrationData?.createdBy}
            doc_category={DOC_SECTION}
            doc_entry="createdBy"
          />
        </Col>
      </Row>

      {deviceData?.deviceData && (
        <Row>
          <h5 style={{ borderBottom: '2px solid', fontWeight: 'bold' }}>Device Information</h5>
          <Col sm={6} xl={4}>
            <GluuFormDetailRow
              label="fields.deviceName"
              value={deviceData.deviceData?.name}
              doc_category={DOC_SECTION}
              doc_entry="deviceName"
            />
          </Col>
          <Col sm={6} xl={4}>
            <GluuFormDetailRow
              label="fields.OSName"
              value={deviceData.deviceData?.os_name || deviceData.deviceData?.osName}
              doc_category={DOC_SECTION}
              doc_entry="OSName"
            />
          </Col>
          <Col sm={6} xl={4}>
            <GluuFormDetailRow
              label="fields.OSVersion"
              value={deviceData.deviceData?.os_version || deviceData.deviceData?.osVersion}
              doc_category={DOC_SECTION}
              doc_entry="OSVersion"
            />
          </Col>
          <Col sm={6} xl={4}>
            <GluuFormDetailRow
              label="fields.platform"
              value={deviceData.deviceData?.platform}
              doc_category={DOC_SECTION}
              doc_entry="platform"
            />
          </Col>
        </Row>
      )}
    </div>
  )
}
export default UserDeviceDetailViewPage
