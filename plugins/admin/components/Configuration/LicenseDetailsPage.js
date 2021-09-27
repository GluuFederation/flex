import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { connect } from 'react-redux'
import GluuFormDetailRow from '../../../../app/routes/Apps/Gluu/GluuFormDetailRow'
import { HeaderMain } from '../../../../app/routes/components/HeaderMain'
import { getLicenseDetails } from '../../redux/actions/LicenseDetailsActions'
import { Container, Row, Col } from '../../../../app/components'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import Alert from '@material-ui/lab/Alert';

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
      <GluuLoader blocking={loading}>
        {item.licenseEnable ?
          (<Container style={{ backgroundColor: '#F5F5F5' }}>
            <Row>
              <Col sm={6}>
                <GluuFormDetailRow
                  label="fields.productName"
                  value={item.productName}
                  isBadge={true}
                  lsize={3}
                  rsize={9}
                />
              </Col>
              <Col sm={6}>
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
              <Col sm={6}>
                <GluuFormDetailRow
                  label="fields.licenseType"
                  value={item.licenseType}
                  isBadge={true}
                  lsize={3}
                  rsize={9}
                />
              </Col>
              <Col sm={6}>
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
              <Col sm={6}>
                <GluuFormDetailRow
                  label="fields.licenseKey"
                  value={item.licenseKey}
                  isBadge={true}
                  lsize={3}
                  rsize={9}
                />
              </Col>
              <Col sm={6}>
                <GluuFormDetailRow
                  label="fields.isLicenseActive"
                  value={item.licenseActive ? "True" : "False"}
                  isBadge={true}
                  lsize={3}
                  rsize={9}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <GluuFormDetailRow
                  label="fields.validityPeriod"
                  value={item.validityPeriod}
                  isBadge={true}
                  lsize={3}
                  rsize={9}
                />
              </Col>
              <Col sm={6}>
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
              <Col sm={6}>
                <GluuFormDetailRow
                  label="fields.customerEmail"
                  value={item.customerEmail}
                  isBadge={true}
                  lsize={3}
                  rsize={9}
                />
              </Col>
              <Col sm={6}>
                <GluuFormDetailRow
                  label="fields.customerName"
                  value={item.customerFirstName + " " + item.customerLastName}
                  isBadge={true}
                  lsize={3}
                  rsize={9}
                />
              </Col>
            </Row>
          </Container>) :
          (<Alert severity="info">{!loading && 'The License Api is not enabled for this application.'}</Alert>)}
      </GluuLoader>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    item: state.licenseDetailsReducer.item,
    loading: state.licenseDetailsReducer.loading,
  }
}
export default connect(mapStateToProps)(LicenseDetailsPage)
