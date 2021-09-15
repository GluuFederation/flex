import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { connect } from 'react-redux'
import GluuFormDetailRow from '../../../../app/routes/Apps/Gluu/GluuFormDetailRow'
import { HeaderMain } from '../../../../app/routes/components/HeaderMain'
import { getLicenseDetails } from '../../redux/actions/LicenseDetailsActions'
import { Container, Row, Col } from '../../../../app/components'

function LicenseDetailsPage({ item, loading, dispatch }) {
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getLicenseDetails())
  }, []);

  return (
    <React.Fragment>
      {/* <Container> */}
      <HeaderMain
        title={t('fields.licenseDetails')}
        className="mb-5 mt-4"
      />
      <Container style={{ backgroundColor: '#F5F5F5' }}>
        <Row>
          <Col sm={3}>
            <GluuFormDetailRow
              label="fields.productName"
              value={item.productName}
              isBadge={true}
            />
          </Col>
          <Col sm={9}>
            <GluuFormDetailRow
              label="fields.productCode"
              value={item.productCode}
              isBadge={true}
              lsize={3}
              rsize={9}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <GluuFormDetailRow
              label="fields.licenseType"
              value={item.licenseType}
              isBadge={true}
            />
          </Col>
          <Col sm={9}>
            <GluuFormDetailRow
              label="fields.maxActivations"
              value={item.maxActivations}
              isBadge={true}
              lsize={3}
              rsize={9}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <GluuFormDetailRow
              label="fields.licenseKey"
              value={item.licenseKey}
              isBadge={true}
            />
          </Col>
          <Col sm={9}>
            <GluuFormDetailRow
              label="fields.isLicenseActive"
              value={item.isLicenseActive}
              isBadge={true}
              lsize={3}
              rsize={9}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <GluuFormDetailRow
              label="fields.validityPeriod"
              value={item.validityPeriod}
              isBadge={true}
            />
          </Col>
          <Col sm={9}>
            <GluuFormDetailRow
              label="fields.companyName"
              value={item.companyName}
              isBadge={true}
              lsize={3}
              rsize={9}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <GluuFormDetailRow
              label="fields.customerEmail"
              value={item.customerEmail}
              isBadge={true}
            />
          </Col>
          <Col sm={9}>
            <GluuFormDetailRow
              label="fields.companyName"
              value={item.customerFirstName + " " + item.customerLastName}
              isBadge={true}
              lsize={3}
              rsize={9}
            />
          </Col>
        </Row>
      </Container>

    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  alert(JSON.stringify(state.licenseDetailsReducer.item))
  return {
    item: state.licenseDetailsReducer.item,
    loading: state.licenseDetailsReducer.loading,
  }
}
export default connect(mapStateToProps)(LicenseDetailsPage)
