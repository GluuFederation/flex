import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useContext } from 'react'

import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import customColors from '@/customColors'
import { getLicenseDetails } from 'Redux/features/licenseDetailsSlice'
import { Card, CardBody, Container, Row, Col, Button } from 'Components'
import { buildPayload } from 'Utils/PermChecker'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import Alert from '@mui/material/Alert'
import SetTitle from 'Utils/SetTitle'
import { formatDate } from 'Utils/Util'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import GluuCommitDialog from '../Apps/Gluu/GluuCommitDialog'
import { useNavigate } from 'react-router'
import type { LicenseField } from './types'
import type { LicenseDetailsState } from 'Redux/features/licenseDetailsSlice'

const FETCHING_LICENSE_DETAILS = 'Fetch license details'

function LicenseDetailsPage() {
  const { item, loading } = useSelector(
    (state: { licenseDetailsReducer: LicenseDetailsState }) => state.licenseDetailsReducer,
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userAction: Record<string, unknown> = {}
  const { t } = useTranslation()
  const { hasCedarWritePermission, authorizeHelper } = useCedarling()
  const [modal, setModal] = useState(false)

  const licenseResourceId = useMemo(() => ADMIN_UI_RESOURCES.License, [])
  const licenseScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[licenseResourceId], [licenseResourceId])
  const canWriteLicense = useMemo(
    () => hasCedarWritePermission(licenseResourceId) === true,
    [hasCedarWritePermission, licenseResourceId],
  )

  const initPermissions = async () => {
    await authorizeHelper(licenseScopes)
  }
  useEffect(() => {
    initPermissions()
    buildPayload(userAction, FETCHING_LICENSE_DETAILS, null)
    dispatch(getLicenseDetails())
  }, [authorizeHelper, dispatch, licenseScopes])
  useEffect(() => {
    item.licenseExpired && navigate('/logout')
  }, [item.licenseExpired, navigate])

  SetTitle(t('menus.licenseDetails'))
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlack'
  const themeColors = getThemeColor(selectedTheme)

  const labelStyle = {
    color: themeColors.fontColor,
  }

  const inputBoxStyle = {
    backgroundColor: customColors.white,
    color: customColors.black,
    borderColor: themeColors.fontColor + '40',
  }

  const licenseFields: LicenseField[] = [
    { key: 'productName', label: 'fields.productName', value: item.productName },
    { key: 'productCode', label: 'fields.productCode', value: item.productCode },
    { key: 'licenseType', label: 'fields.licenseType', value: item.licenseType },
    { key: 'licenseKey', label: 'fields.licenseKey', value: item.licenseKey },
    { key: 'customerEmail', label: 'fields.customerEmail', value: item.customerEmail },
    {
      key: 'customerName',
      label: 'fields.customerName',
      value:
        !item.customerFirstName && !item.customerLastName
          ? '-'
          : item.customerFirstName + ' ' + item.customerLastName,
    },
    { key: 'companyName', label: 'fields.companyName', value: item.companyName },
    {
      key: 'validityPeriod',
      label: 'fields.validityPeriod',
      value: item.validityPeriod ? formatDate(item.validityPeriod) : null,
    },
    {
      key: 'isLicenseActive',
      label: 'fields.isLicenseActive',
      value: item.licenseActive ? 'Yes' : 'No',
    },
    {
      key: 'isLicenseExpired',
      label: 'fields.isLicenseExpired',
      value: item.licenseExpired ? 'Yes' : 'No',
    },
  ]

  const renderLicenseField = (field: LicenseField) => (
    <Col sm={6} xs={12} key={field.key}>
      <div className="mb-3">
        <strong style={labelStyle}>{t(field.label)}:</strong>
        <div className="mt-1 p-2 border rounded" style={inputBoxStyle}>
          {field.value || 'N/A'}
        </div>
      </div>
    </Col>
  )

  const handleReset = (message: string) => {
    setModal((prev) => !prev)
    dispatch({ type: 'license/resetConfig', message })
  }
  const toggle = () => {
    setModal((prev) => !prev)
  }

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.persistenceCard}>
        <CardBody style={{ padding: '15px' }}>
          {item.licenseEnabled ? (
            <>
              <Container
                style={{
                  backgroundColor: themeColors.lightBackground,
                  padding: '20px',
                  borderRadius: '8px',
                }}
              >
                {licenseFields?.map((field, index) => {
                  if (index % 2 === 0) {
                    const nextField = licenseFields[index + 1]
                    return (
                      <Row className="mb-3" key={`row-${index}`}>
                        {renderLicenseField(field)}
                        {nextField && renderLicenseField(nextField)}
                      </Row>
                    )
                  }
                  return null
                })}
              </Container>
              {canWriteLicense && (
                <Container>
                  <Row className="mt-4">
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <div className="d-flex justify-content-start">
                        <Button
                          style={{
                            backgroundColor: customColors.accentRed,
                            color: customColors.white,
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: 500,
                            borderRadius: 6,
                          }}
                          size="md"
                          onClick={toggle}
                        >
                          <i className="fa fa-undo-alt me-2"></i>
                          {t('fields.resetLicense')}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Container>
              )}
              <GluuCommitDialog
                handler={toggle}
                modal={modal}
                onAccept={(userMessage) => handleReset(userMessage)}
                isLicenseLabel={true}
              />
            </>
          ) : (
            <Alert severity="warning">{!loading && t('messages.license_api_not_enabled')}</Alert>
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default LicenseDetailsPage
