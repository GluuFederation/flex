import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { Card, CardBody, GluuPageContent } from 'Components'
import { useLicenseDetails } from './hooks/useLicenseDetails'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuRefreshButton } from '@/components/GluuSearchToolbar'
import Alert from '@mui/material/Alert'
import SetTitle from 'Utils/SetTitle'
import { formatDate } from 'Utils/Util'
import { formatLicenseFieldValue } from '@/utils/licenseUtils'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import GluuCommitDialog from '../Apps/Gluu/GluuCommitDialog'
import type { LicenseField } from './types'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useStyles } from './LicenseDetailsPage.style'

const PLACEHOLDER = '_'
const LICENSE_RESOURCE_ID = ADMIN_UI_RESOURCES.License
const LICENSE_SCOPES = CEDAR_RESOURCE_SCOPES[LICENSE_RESOURCE_ID]

const LICENSE_FIELD_CONFIG: ReadonlyArray<{ key: string; label: string }> = [
  { key: 'productName', label: 'fields.productName' },
  { key: 'productCode', label: 'fields.productCode' },
  { key: 'licenseType', label: 'fields.licenseType' },
  { key: 'licenseKey', label: 'fields.licenseKey' },
  { key: 'customerEmail', label: 'fields.customerEmail' },
  { key: 'customerName', label: 'fields.customerName' },
  { key: 'companyName', label: 'fields.companyName' },
  { key: 'validityPeriod', label: 'fields.validityPeriod' },
  { key: 'isLicenseActive', label: 'fields.isLicenseActive' },
  { key: 'isLicenseExpired', label: 'fields.isLicenseExpired' },
]

const LicenseDetailsPage = () => {
  const { navigateToRoute } = useAppNavigation()
  const { item, loading, resetLicense, isResetting } = useLicenseDetails({
    onResetSuccess: () => navigateToRoute(ROUTES.LOGOUT),
  })
  const { t } = useTranslation()
  const { hasCedarWritePermission, authorizeHelper } = useCedarling()
  const [modal, setModal] = useState(false)

  const canWriteLicense = useMemo(
    () => hasCedarWritePermission(LICENSE_RESOURCE_ID),
    [hasCedarWritePermission],
  )

  useEffect(() => {
    if (LICENSE_SCOPES?.length) {
      authorizeHelper(LICENSE_SCOPES)
    }
  }, [authorizeHelper])

  useEffect(() => {
    if (item?.licenseExpired) {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [item?.licenseExpired, navigateToRoute])

  SetTitle(t('menus.licenseDetails'))
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const isDark = selectedTheme === THEME_DARK
  const { classes } = useStyles({ themeColors, isDark })

  const licenseFields = useMemo<LicenseField[]>(
    () =>
      LICENSE_FIELD_CONFIG.map(({ key, label }) => {
        let value: string | null
        if (loading) {
          value = PLACEHOLDER
        } else if (key === 'customerName') {
          value = [item.customerFirstName, item.customerLastName].filter(Boolean).join(' ') || null
        } else if (key === 'validityPeriod') {
          value = item.validityPeriod ? formatDate(item.validityPeriod) : null
        } else if (key === 'isLicenseActive') {
          value = item.licenseActive ? t('actions.yes') : t('actions.no')
        } else if (key === 'isLicenseExpired') {
          value = item.licenseExpired ? t('actions.yes') : t('actions.no')
        } else {
          value = (item as Record<string, string | undefined>)[key] ?? null
        }
        return { key, label, value }
      }),
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
      resetLicense(message)
    },
    [resetLicense],
  )

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const hasLicenseData = !loading && (item?.licenseKey || item?.productName || item?.licenseEnabled)
  const showLicenseCard = loading || hasLicenseData

  return (
    <GluuLoader blocking={loading || isResetting}>
      <GluuPageContent>
        {showLicenseCard ? (
          <div className={classes.licenseCard}>
            <div className={classes.licenseContent}>
              {licenseFields?.map((field) => renderLicenseField(field))}
            </div>
            {canWriteLicense && (
              <div className={classes.buttonContainer}>
                <GluuRefreshButton
                  className={classes.resetButton}
                  variant="primary"
                  onClick={toggle}
                  disabled={loading || isResetting}
                  label={t('fields.resetLicense')}
                />
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
