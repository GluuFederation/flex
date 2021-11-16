import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import LicenseDetailsForm from './LicenseDetailsForm'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuFormDetailRow from '../../../../app/routes/Apps/Gluu/GluuFormDetailRow'
import { LICENSE } from '../../../../app/utils/ApiResources'
import {
  getLicenseDetails,
  updateLicenseDetails,
} from '../../redux/actions/LicenseDetailsActions'
import { Container, Row, Col } from '../../../../app/components'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import Alert from '@material-ui/lab/Alert'

function LicenseDetailsPage({ item, loading, dispatch }) {
  const [validityPeriod, setValidityPeriod] = useState(
    !!item.validityPeriod ? new Date(item.validityPeriod) : new Date(),
  )
  useEffect(() => {
    dispatch(getLicenseDetails())
  }, [])
  useEffect(() => {
    setValidityPeriod(new Date(item.validityPeriod))
  }, [item.validityPeriod])

  function handleSubmit(data) {
    if (data) {
      dispatch(updateLicenseDetails(data))
    }
  }

  return (
    <React.Fragment>
      {/* <Container> */}
      <GluuLabel label="fields.licenseDetails" size={8} />
      <GluuLoader blocking={loading}>
        {item.licenseEnable ? (
          <>
            <Container style={{ backgroundColor: '#F5F5F5' }}>
              <Row>
                <Col sm={6}>
                  <GluuFormDetailRow
                    label="fields.productName"
                    value={item.productName}
                    isBadge={true}
                    lsize={3}
                    rsize={9}
                    doc_entry="productName"
                    doc_category={LICENSE}
                  />
                </Col>
                <Col sm={6}>
                  <GluuFormDetailRow
                    label="fields.productCode"
                    value={item.productCode}
                    isBadge={true}
                    lsize={3}
                    rsize={9}
                    doc_entry="productCode"
                    doc_category={LICENSE}
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
                    doc_entry="licenseType"
                    doc_category={LICENSE}
                  />
                </Col>
                <Col sm={6}>
                  <GluuFormDetailRow
                    label="fields.licenseKey"
                    value={item.licenseKey}
                    isBadge={true}
                    lsize={3}
                    rsize={9}
                    doc_entry="licenseKey"
                    doc_category={LICENSE}
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
                    doc_entry="customerEmail"
                    doc_category={LICENSE}
                  />
                </Col>
                <Col sm={6}>
                  <GluuFormDetailRow
                    label="fields.customerName"
                    value={item.customerFirstName + ' ' + item.customerLastName}
                    isBadge={true}
                    lsize={3}
                    rsize={9}
                    doc_entry="customerName"
                    doc_category={LICENSE}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <GluuFormDetailRow
                    label="fields.companyName"
                    value={item.companyName}
                    isBadge={true}
                    lsize={3}
                    rsize={9}
                    doc_entry="companyName"
                    doc_category={LICENSE}
                  />
                </Col>
              </Row>
            </Container>
            <hr></hr>
            <LicenseDetailsForm item={item} handleSubmit={handleSubmit} />
          </>
        ) : (
          <Alert severity="info">
            {!loading && 'The License Api is not enabled for this application.'}
          </Alert>
        )}
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
