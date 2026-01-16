import React, { useEffect, useMemo, useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '@/context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { getLicenseDetails } from 'Redux/features/licenseDetailsSlice'
import { Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import Alert from '@mui/material/Alert'
import SetTitle from 'Utils/SetTitle'
import { formatDate } from 'Utils/Util'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import GluuCommitDialog from '../Apps/Gluu/GluuCommitDialog'
import type { LicenseField } from './types'
import type { LicenseDetailsState } from 'Redux/features/licenseDetailsSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useStyles } from './LicenseDetailsPage.style'

function LicenseDetailsPage() {
  const { item, loading } = useSelector(
    (state: { licenseDetailsReducer: LicenseDetailsState }) => state.licenseDetailsReducer,
  )
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { hasCedarWritePermission, authorizeHelper } = useCedarling()
  const [modal, setModal] = useState(false)
  const { navigateToRoute } = useAppNavigation()

  const licenseResourceId = useMemo(() => ADMIN_UI_RESOURCES.License, [])
  const licenseScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[licenseResourceId], [licenseResourceId])
  const canWriteLicense = useMemo(
    () => hasCedarWritePermission(licenseResourceId),
    [hasCedarWritePermission, licenseResourceId],
  )

  useEffect(() => {
    if (licenseScopes && licenseScopes.length > 0) {
      authorizeHelper(licenseScopes)
    }
  }, [authorizeHelper, licenseScopes])

  useEffect(() => {
    dispatch(getLicenseDetails())
  }, [dispatch])
  useEffect(() => {
    if (item.licenseExpired) {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [item.licenseExpired, navigateToRoute])

  SetTitle(t('menus.licenseDetails'))
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const { classes } = useStyles({ isDark })

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
    <div key={field.key} className={classes.fieldWrapper}>
      <span className={classes.label}>{t(field.label)}:</span>
      <span className={classes.value}>{field.value || 'N/A'}</span>
    </div>
  )

  const handleReset = (message: string) => {
    setModal((prev) => !prev)
    dispatch({ type: 'license/resetConfig', message })
  }
  const toggle = () => {
    setModal((prev) => !prev)
  }

  const hasLicenseData = !loading && (item.licenseKey || item.productName || item.licenseEnabled)

  return (
    <GluuLoader blocking={loading}>
      <div className={classes.pageContainer}>
        {hasLicenseData ? (
          <>
            <div className={classes.licenseCard}>
              <div className={classes.licenseContent}>
                {licenseFields?.map((field) => renderLicenseField(field))}
              </div>
              {canWriteLicense && (
                <div className={classes.buttonContainer}>
                  <button type="button" className={classes.removeButton} onClick={toggle}>
                    {t('fields.resetLicense')}
                  </button>
                </div>
              )}
            </div>
            <GluuCommitDialog
              handler={toggle}
              modal={modal}
              onAccept={(userMessage) => handleReset(userMessage)}
              isLicenseLabel={true}
            />
          </>
        ) : !loading ? (
          <Card className={classes.card}>
            <CardBody className={classes.cardBody}>
              <Alert severity="error">{t('messages.license_api_not_enabled')}</Alert>
            </CardBody>
          </Card>
        ) : null}
      </div>
    </GluuLoader>
  )
}

export default LicenseDetailsPage
