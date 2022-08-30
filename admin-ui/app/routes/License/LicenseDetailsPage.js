import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { LICENSE } from 'Utils/ApiResources'
import { getLicenseDetails } from 'Redux/actions/LicenseDetailsActions'
import { Card, CardBody, Container, Row, Col } from 'Components'
import { buildPayload } from 'Utils/PermChecker'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import Alert from '@material-ui/lab/Alert'
import SetTitle from 'Utils/SetTitle'

const FETCHING_LICENSE_DETAILS = 'Fetch license details'

function LicenseDetailsPage({ item, loading, dispatch }) {
  const userAction = {}
  const options = {}
  const { t } = useTranslation()

  useEffect(() => {
    buildPayload(userAction, FETCHING_LICENSE_DETAILS, options)
    dispatch(getLicenseDetails({}))
  }, [])

  function formatDate(date) {
    if (date == undefined) {
      return ''
    }
    if (date.length > 10) {
      return date.substring(0, 10)
    }
    return ''
  }
  SetTitle(t('fields.licenseDetails'))
  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          {item.licenseEnabled ? (
            <Container style={{ backgroundColor: '#F5F5F5', float: 'left' }}>
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
                <Col sm={6}>
                  <GluuFormDetailRow
                    label="fields.validityPeriod"
                    value={formatDate(item.validityPeriod)}
                    isBadge={true}
                    lsize={3}
                    rsize={9}
                    doc_entry="validityPeriod"
                    doc_category={LICENSE}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <GluuFormDetailRow
                    label="fields.isLicenseActive"
                    value={item.licenseActive ? 'Yes' : 'No'}
                    isBadge={true}
                    lsize={3}
                    rsize={9}
                    doc_entry="isLicenseActive"
                    doc_category={LICENSE}
                  />
                </Col>
              </Row>
            </Container>
          ) : (
            <Alert severity="warning">
              {!loading &&
                'The License API is not enabled for this application.'}
            </Alert>
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    item: state.licenseDetailsReducer.item,
    loading: state.licenseDetailsReducer.loading,
  }
}
export default connect(mapStateToProps)(LicenseDetailsPage)
