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
import MappingItem from './MappingItem'
import SetTitle from 'Utils/SetTitle'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useMappingData } from './hooks'
import { useStyles } from './styles/MappingPage.style'

const MappingPage: React.FC = React.memo(function MappingPage() {
  const { t } = useTranslation()
  SetTitle(t('titles.mapping'))

  const { state } = useTheme()
  const isDark = state.theme === THEME_DARK
  const currentTheme = themeConfig[state.theme]
  const { classes } = useStyles({ isDark, theme: currentTheme })

  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const mappingResourceId = ADMIN_UI_RESOURCES.Security
  const mappingScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[mappingResourceId] || [],
    [mappingResourceId],
  )
  const canReadMapping = hasCedarReadPermission(mappingResourceId)

  const { mapping, permissions, isLoading, isError } = useMappingData(canReadMapping)

  const allPermissions = useMemo(
    () => permissions.map((p) => p.permission).filter(Boolean) as string[],
    [permissions],
  )

  useEffect(() => {
    if (mappingScopes.length > 0) {
      authorizeHelper(mappingScopes)
    }
  }, [authorizeHelper, mappingScopes])

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
                <MappingItem
                  key={candidate?.role || idx}
                  candidate={candidate}
                  allPermissions={allPermissions}
                />
              ))}
            </Box>
          </GluuViewWrapper>
        </Box>
      </GluuPageContent>
    </GluuLoader>
  )
})

export default MappingPage
