import React, { useEffect, useMemo, useState, useContext, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '@/context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import customColors from '@/customColors'
import { getLicenseDetails } from 'Redux/features/licenseDetailsSlice'
import { Card, CardBody, GluuPageContent } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import Alert from '@mui/material/Alert'
import SetTitle from 'Utils/SetTitle'
import { formatDate } from 'Utils/Util'
import { formatLicenseFieldValue } from '@/utils/licenseUtils'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import GluuCommitDialog from '../Apps/Gluu/GluuCommitDialog'
import type { LicenseField } from './types'
import type { LicenseDetailsState } from 'Redux/features/licenseDetailsSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useStyles } from './LicenseDetailsPage.style'

const PLACEHOLDER = '_'

const LicenseDetailsPage = () => {
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
  const themeContext = useContext(ThemeContext)
  const selectedTheme = themeContext?.state?.theme || DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const { classes } = useStyles({ isDark })

  const licenseFields = useMemo<LicenseField[]>(
    () => [
      {
        key: 'productName',
        label: 'fields.productName',
        value: loading ? PLACEHOLDER : item.productName,
      },
      {
        key: 'productCode',
        label: 'fields.productCode',
        value: loading ? PLACEHOLDER : item.productCode,
      },
      {
        key: 'licenseType',
        label: 'fields.licenseType',
        value: loading ? PLACEHOLDER : item.licenseType,
      },
      {
        key: 'licenseKey',
        label: 'fields.licenseKey',
        value: loading ? PLACEHOLDER : item.licenseKey,
      },
      {
        key: 'customerEmail',
        label: 'fields.customerEmail',
        value: loading ? PLACEHOLDER : item.customerEmail,
      },
      {
        key: 'customerName',
        label: 'fields.customerName',
        value: loading
          ? PLACEHOLDER
          : [item.customerFirstName, item.customerLastName].filter(Boolean).join(' '),
      },
      {
        key: 'companyName',
        label: 'fields.companyName',
        value: loading ? PLACEHOLDER : item.companyName,
      },
      {
        key: 'validityPeriod',
        label: 'fields.validityPeriod',
        value: loading ? PLACEHOLDER : item.validityPeriod ? formatDate(item.validityPeriod) : null,
      },
      {
        key: 'isLicenseActive',
        label: 'fields.isLicenseActive',
        value: loading ? PLACEHOLDER : item.licenseActive ? t('actions.yes') : t('actions.no'),
      },
      {
        key: 'isLicenseExpired',
        label: 'fields.isLicenseExpired',
        value: loading ? PLACEHOLDER : item.licenseExpired ? t('actions.yes') : t('actions.no'),
      },
    ],
    [loading, item, t],
  )

  const renderLicenseField = useCallback(
    (field: LicenseField) => {
      const displayValue = formatLicenseFieldValue(field.value)
      return (
        <div key={field.key} className={classes.fieldWrapper}>
          <GluuText variant="div" className={classes.label}>
            {t(field.label)}:
          </GluuText>
          <GluuText variant="div" className={classes.value}>
            {displayValue}
          </GluuText>
        </div>
      )
    },
    [classes.fieldWrapper, classes.label, classes.value, t],
  )

  const handleReset = useCallback(
    (message: string) => {
      setModal((prev) => !prev)
      dispatch({ type: 'license/resetConfig', message })
    },
    [dispatch],
  )

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const hasLicenseData = !loading && (item.licenseKey || item.productName || item.licenseEnabled)
  const showLicenseCard = loading || hasLicenseData

  return (
    <GluuLoader blocking={loading}>
      <GluuPageContent>
        {showLicenseCard ? (
          <div className={classes.licenseCard}>
            <div className={classes.licenseContent}>
              {licenseFields?.map((field) => renderLicenseField(field))}
            </div>
            {canWriteLicense && (
              <div className={classes.buttonContainer}>
                <GluuButton
                  onClick={toggle}
                  disabled={loading}
                  backgroundColor={customColors.statusActive}
                  textColor={customColors.white}
                  useOpacityOnHover
                  style={{ gap: 8 }}
                >
                  <i className="fa fa-refresh" style={{ fontSize: 16 }} />
                  {t('fields.resetLicense')}
                </GluuButton>
              </div>
            )}
          </div>
        ) : (
          <Card className={classes.card}>
            <CardBody className={classes.cardBody}>
              <Alert severity="error">{t('messages.license_api_not_enabled')}</Alert>
            </CardBody>
          </Card>
        )}
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={(userMessage) => handleReset(userMessage)}
          isLicenseLabel={true}
        />
      </GluuPageContent>
    </GluuLoader>
  )
}

export default LicenseDetailsPage
