import React from "react";
import { Container, Row, Col } from "Components";
import GluuFormDetailRow from "Routes/Apps/Gluu/GluuFormDetailRow";
import PropTypes from 'prop-types'

interface UserDeviceDetailViewPageProps {
  row: {
    rowData: any;
  };
}

const UserDeviceDetailViewPage = ({ row }: UserDeviceDetailViewPageProps) => {
  const { rowData } = row;
  const DOC_SECTION = "user";

  return (
    <Container style={{ backgroundColor: "#F5F5F5", minWidth: "100%" }}>
      <Row>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.domain"
            value={rowData.registrationData.domain}
            doc_category={DOC_SECTION}
            doc_entry="domain"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.type"
            value={rowData.registrationData.type}
            doc_category={DOC_SECTION}
            doc_entry="type"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.status"
            value={rowData.registrationData.status}
            doc_category={DOC_SECTION}
            doc_entry="status"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.createdBy"
            value={rowData.registrationData.createdBy}
            doc_category={DOC_SECTION}
            doc_entry="createdBy"
          />
        </Col>
      </Row>

      {rowData?.deviceData && (
        <Row>
          <h5 style={{ borderBottom: "2px solid", fontWeight: "bold" }}>
            Device Information
          </h5>
          <Col sm={6} xl={4}>
            <GluuFormDetailRow
              label="fields.deviceName"
              value={rowData.deviceData.name}
              doc_category={DOC_SECTION}
              doc_entry="deviceName"
            />
          </Col>
          <Col sm={6} xl={4}>
            <GluuFormDetailRow
              label="fields.OSName"
              value={rowData.deviceData.os_name}
              doc_category={DOC_SECTION}
              doc_entry="OSName"
            />
          </Col>
          <Col sm={6} xl={4}>
            <GluuFormDetailRow
              label="fields.OSVersion"
              value={rowData.deviceData.os_version}
              doc_category={DOC_SECTION}
              doc_entry="OSVersion"
            />
          </Col>
          <Col sm={6} xl={4}>
            <GluuFormDetailRow
              label="fields.platform"
              value={rowData.deviceData.platform}
              doc_category={DOC_SECTION}
              doc_entry="platform"
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

UserDeviceDetailViewPage.propTypes = {
  row: PropTypes.any,
};

export default UserDeviceDetailViewPage;
