import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import SetTitle from 'Utils/SetTitle'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuThemeFormFooter from '@/routes/Apps/Gluu/GluuThemeFormFooter'
import { GluuPageContent } from 'Components'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useGetPropertiesPersistence } from 'JansConfigApi'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './PersistenceDetail.style'
import { queryDefaults } from '@/utils/queryUtils'

function PersistenceDetail() {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const selectedTheme = useMemo(() => themeState.theme || DEFAULT_THEME, [themeState.theme])
  const isDark = useMemo(() => selectedTheme === THEME_DARK, [selectedTheme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })

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

  useEffect(() => {
    authorizeHelper(persistenceScopes)
  }, [authorizeHelper, persistenceScopes])

  const { data: persistenceData, isLoading } = useGetPropertiesPersistence({
    query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadPersistence },
  })

  const databaseInfo = persistenceData || {}

  return (
    <GluuLoader blocking={isLoading}>
      <GluuViewWrapper canShow={canReadPersistence}>
        <GluuPageContent>
          <div className={classes.persistenceCard}>
            <div className={`${classes.content} ${classes.formLabels} ${classes.formWithInputs}`}>
              <div className={classes.fieldsGrid}>
                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.database_name"
                    name="databaseName"
                    value={databaseInfo.databaseName || ''}
                    lsize={12}
                    rsize={12}
                    disabled
                    isDark={isDark}
                    doc_category="persistence"
                    doc_entry="databaseName"
                  />
                </div>
                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.schema_name"
                    name="schemaName"
                    value={databaseInfo.schemaName || ''}
                    lsize={12}
                    rsize={12}
                    disabled
                    isDark={isDark}
                    doc_category="persistence"
                    doc_entry="schemaName"
                  />
                </div>
                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.product_name"
                    name="productName"
                    value={databaseInfo.productName || ''}
                    lsize={12}
                    rsize={12}
                    disabled
                    isDark={isDark}
                    doc_category="persistence"
                    doc_entry="productName"
                  />
                </div>
                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.product_version"
                    name="productVersion"
                    value={databaseInfo.productVersion || ''}
                    lsize={12}
                    rsize={12}
                    disabled
                    isDark={isDark}
                    doc_category="persistence"
                    doc_entry="productVersion"
                  />
                </div>
                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.driver_name"
                    name="driverName"
                    value={databaseInfo.driverName || ''}
                    lsize={12}
                    rsize={12}
                    disabled
                    isDark={isDark}
                    doc_category="persistence"
                    doc_entry="driverName"
                  />
                </div>
                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.driver_version"
                    name="driverVersion"
                    value={databaseInfo.driverVersion || ''}
                    lsize={12}
                    rsize={12}
                    disabled
                    isDark={isDark}
                    doc_category="persistence"
                    doc_entry="driverVersion"
                  />
                </div>
              </div>

              <GluuThemeFormFooter showBack hideDivider />
            </div>
          </div>
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default PersistenceDetail
