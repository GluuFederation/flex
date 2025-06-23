import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { LICENSE } from 'Utils/ApiResources'
import { getLicenseDetails, LicenseDetailsItem } from 'Redux/features/licenseDetailsSlice'
import { Card, CardBody, Container, Row, Col } from 'Components'
import { buildPayload } from 'Utils/PermChecker'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import Alert from '@mui/material/Alert'
import SetTitle from 'Utils/SetTitle'
import { formatDate } from 'Utils/Util'

const FETCHING_LICENSE_DETAILS = 'Fetch license details'

interface RootState {
  licenseDetailsReducer: {
    item: LicenseDetailsItem
    loading: boolean
  }
}

function LicenseDetailsPage(): JSX.Element {
  const item = useSelector((state: RootState) => state.licenseDetailsReducer.item)
  const loading = useSelector((state: RootState) => state.licenseDetailsReducer.loading)
  const dispatch = useDispatch()
  const userAction: Record<string, any> = {}
  const options: Record<string, any> = {}
  const { t } = useTranslation()

  useEffect(() => {
    buildPayload(userAction, FETCHING_LICENSE_DETAILS, options)
    dispatch(getLicenseDetails())
  }, [dispatch])

  SetTitle(t('fields.licenseDetails'))
  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3" type="border" color={null}>
        <CardBody>
          {item.licenseEnabled ? (
            <Container style={{ backgroundColor: applicationStyle.licensePanel.backgroundColor, float: 'left' as const }}>
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
                    value={!item.customerFirstName && !item.customerLastName ? undefined : ((item.customerFirstName || '') + (item.customerLastName || ''))}
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
                <Col sm={6}>
                  <GluuFormDetailRow
                    label="fields.isLicenseExpired"
                    value={item.licenseExpired ? 'Yes' : 'No'}
                    isBadge={true}
                    lsize={3}
                    rsize={9}
                    doc_entry="isLicenseExpired"
                    doc_category={LICENSE}
                  />
                </Col>
              </Row>
            </Container>
          ) : (
            <Alert severity="warning">
              {!loading && t('messages.license_api_not_enabled')}
            </Alert>
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default LicenseDetailsPage
