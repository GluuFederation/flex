import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import LicenseDetailsForm from './LicenseDetailsForm'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
import GluuFormDetailRow from '../../../../app/routes/Apps/Gluu/GluuFormDetailRow'
import { LICENSE } from '../../../../app/utils/ApiResources'
import {
  getLicenseDetails,
  updateLicenseDetails,
} from '../../redux/actions/LicenseDetailsActions'
import {
  Card,
  CardBody,
  CardTitle,
  Container,
  FormGroup,
  Row,
  Col,
} from '../../../../app/components'
import {
  buildPayload,
} from '../../../../app/utils/PermChecker'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import Alert from '@material-ui/lab/Alert'
import {
  FETCHING_LICENSE_DETAILS,
} from '../../common/Constants'

function LicenseDetailsPage({ item, loading, dispatch }) {
  const userAction = {}
  const options = {}

  useEffect(() => {
    buildPayload(userAction, FETCHING_LICENSE_DETAILS, options)
    dispatch(getLicenseDetails({}))
  }, [])

  function formatDate(date) {
    if(date == undefined) {
      return '';
    }
    if(date.length > 10) {
      return date.substring(0, 10);
    }
    return '';

  }
  return (
    <React.Fragment>
      <Card className="mb-3">
        <CardBody>
          <CardTitle tag="h6" className="mb-4">
            <GluuRibbon title="fields.licenseDetails" doTranslate fromLeft />
            <FormGroup row />
            <FormGroup row />
          </CardTitle>
          <GluuLoader blocking={loading}>
            {item.licenseEnabled ? (
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
                        value={
                          item.customerFirstName + ' ' + item.customerLastName
                        }
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
              </>
            ) : (
              <Alert severity="warning">
                {!loading &&
                  'The License API is not enabled for this application.'}
              </Alert>
            )}
          </GluuLoader>
        </CardBody>
      </Card>
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
