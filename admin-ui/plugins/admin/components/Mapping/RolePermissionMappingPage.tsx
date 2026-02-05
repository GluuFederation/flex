import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Box } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useTheme } from '@/context/theme/themeContext'
import { themeConfig } from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { GluuPageContent } from '@/components'
import RolePermissionCard from './RolePermissionCard'
import SetTitle from 'Utils/SetTitle'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useMappingData } from './hooks'
import { useStyles } from './styles/MappingPage.style'

const MAPPING_RESOURCE_ID = ADMIN_UI_RESOURCES.Security
const MAPPING_SCOPES = CEDAR_RESOURCE_SCOPES[MAPPING_RESOURCE_ID] || []

const RolePermissionMappingPage: React.FC = React.memo(function RolePermissionMappingPage() {
  const { t } = useTranslation()
  SetTitle(t('titles.mapping'))

  const { state } = useTheme()
  const isDark = state.theme === THEME_DARK
  const currentTheme = themeConfig[state.theme]
  const { classes } = useStyles({ isDark, theme: currentTheme })

  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const canReadMapping = hasCedarReadPermission(MAPPING_RESOURCE_ID)

  const { mapping, permissions, isLoading, isError } = useMappingData(canReadMapping)

  const allPermissions = useMemo(
    () => permissions.map((p) => p.permission).filter(Boolean) as string[],
    [permissions],
  )

  useEffect(() => {
    if (MAPPING_SCOPES.length > 0) {
      authorizeHelper(MAPPING_SCOPES)
    }
  }, [authorizeHelper])

  return (
    <GluuLoader blocking={isLoading}>
      <GluuPageContent>
        <Box className={classes.pageWrapper}>
          <GluuText variant="h2" className={classes.pageDescription} disableThemeColor>
            {t('messages.role_permission_mapping_description')}
          </GluuText>

          <Box className={classes.infoAlert}>
            <InfoOutlined className={classes.infoIcon} />
            <GluuText variant="span" className={classes.infoText} disableThemeColor>
              {t('documentation.mappings.note_prefix')}{' '}
              <Link to="/adm/cedarlingconfig" className={classes.infoLink}>
                Cedarling
              </Link>{' '}
              {t('documentation.mappings.note_suffix')}
            </GluuText>
          </Box>

          {isError && (
            <Alert severity="error" className={classes.errorAlert}>
              {t('messages.error_loading_mapping')}
            </Alert>
          )}

          <GluuViewWrapper canShow={canReadMapping}>
            <Box>
              {mapping.map((candidate, idx) => (
                <RolePermissionCard
                  key={candidate?.role || idx}
                  candidate={candidate}
                  allPermissions={allPermissions}
                  itemIndex={idx}
                />
              ))}
            </Box>
          </GluuViewWrapper>
        </Box>
      </GluuPageContent>
    </GluuLoader>
  )
})

export default RolePermissionMappingPage
