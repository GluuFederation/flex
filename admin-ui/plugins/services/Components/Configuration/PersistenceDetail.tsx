import React, { useEffect, useContext, useMemo, ReactElement } from 'react'
import { Container, Row, Col, Card, CardBody } from 'Components'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import SetTitle from 'Utils/SetTitle'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import customColors from '@/customColors'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useGetPropertiesPersistence } from 'JansConfigApi'
import { DEFAULT_THEME } from '@/context/theme/constants'

interface DatabaseField {
  key: string
  label: string
  tooltip: string
  value: string | undefined
}

function PersistenceDetail(): ReactElement | null {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const persistenceResourceId = useMemo(() => ADMIN_UI_RESOURCES.Persistence, [])
  const persistenceScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[persistenceResourceId],
    [persistenceResourceId],
  )
  const canReadPersistence = useMemo(
    () => hasCedarReadPermission(persistenceResourceId),
    [hasCedarReadPermission, persistenceResourceId],
  )

  SetTitle(t('menus.persistence'))

  const { data: persistenceData, isLoading: databaseInfoLoading } = useGetPropertiesPersistence({
    query: { staleTime: 30000, enabled: canReadPersistence },
  })

  const databaseInfo = persistenceData || {}

  const labelStyle = {
    color: themeColors.fontColor,
  }

  const inputBoxStyle = {
    backgroundColor: customColors.white,
    color: customColors.black,
    borderColor: themeColors.fontColor + '40',
  }

  const databaseFields: DatabaseField[] = [
    {
      key: 'databaseName',
      label: 'fields.database_name',
      tooltip: 'tooltips.database_name',
      value: databaseInfo.databaseName,
    },
    {
      key: 'schemaName',
      label: 'fields.schema_name',
      tooltip: 'tooltips.schema_name',
      value: databaseInfo.schemaName,
    },
    {
      key: 'productName',
      label: 'fields.product_name',
      tooltip: 'tooltips.product_name',
      value: databaseInfo.productName,
    },
    {
      key: 'productVersion',
      label: 'fields.product_version',
      tooltip: 'tooltips.product_version',
      value: databaseInfo.productVersion,
    },
    {
      key: 'driverName',
      label: 'fields.driver_name',
      tooltip: 'tooltips.driver_name',
      value: databaseInfo.driverName,
    },
    {
      key: 'driverVersion',
      label: 'fields.driver_version',
      tooltip: 'tooltips.driver_version',
      value: databaseInfo.driverVersion,
    },
  ]

  const renderDatabaseField = (field: DatabaseField): ReactElement => (
    <Col sm={6} key={field.key}>
      <GluuTooltip doc_category={t(field.tooltip)} doc_entry={field.tooltip} isDirect={true}>
        <div className="mb-3">
          <strong style={labelStyle}>{t(field.label)}:</strong>
          <div className="mt-1 p-2 border rounded" style={inputBoxStyle}>
            {field.value || 'N/A'}
          </div>
        </div>
      </GluuTooltip>
    </Col>
  )

  useEffect(() => {
    authorizeHelper(persistenceScopes)
  }, [authorizeHelper, persistenceScopes])

  if (!canReadPersistence) {
    return null
  }

  if (databaseInfoLoading) {
    return (
      <Card style={applicationStyle.persistenceCard}>
        <CardBody>
          <div className="text-center">{t('titles.loading_database_information')}</div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card style={applicationStyle.persistenceCard}>
      <CardBody
        style={{
          padding: '30px',
        }}
      >
        <Container
          style={{
            backgroundColor: themeColors.lightBackground,
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          {databaseFields.map((field, index) => {
            if (index % 2 === 0) {
              const nextField = databaseFields[index + 1]
              return (
                <Row className="mb-3" key={`row-${index}`}>
                  {renderDatabaseField(field)}
                  {nextField && renderDatabaseField(nextField)}
                </Row>
              )
            }
            return null
          })}
        </Container>
        <div className="mt-3">
          <GluuFormFooter showBack={true} showCancel={false} showApply={false} />
        </div>
      </CardBody>
    </Card>
  )
}

export default PersistenceDetail
