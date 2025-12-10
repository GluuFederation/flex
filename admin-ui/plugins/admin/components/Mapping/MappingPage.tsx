import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Alert, Box } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import MappingItem from './MappingItem'
import SetTitle from 'Utils/SetTitle'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { Link } from 'react-router-dom'
import { useMappingData } from './hooks'

const MappingPage: React.FC = React.memo(function MappingPage() {
  const { t } = useTranslation()
  SetTitle(t('titles.mapping'))
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const mappingResourceId = useMemo(() => ADMIN_UI_RESOURCES.Security, [])
  const mappingScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[mappingResourceId] || [],
    [mappingResourceId],
  )
  const canReadMapping = useMemo(
    () => hasCedarReadPermission(mappingResourceId),
    [hasCedarReadPermission, mappingResourceId],
  )

  const { mapping, isLoading, isError } = useMappingData(canReadMapping)

  useEffect(() => {
    if (mappingScopes && mappingScopes.length > 0) {
      authorizeHelper(mappingScopes)
    }
  }, [authorizeHelper, mappingScopes])

  const mappingList = useMemo(
    () =>
      mapping.map((candidate, idx) => (
        <MappingItem key={candidate?.role || idx} candidate={candidate} />
      )),
    [mapping],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              {t('titles.mapping')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('messages.role_permission_mapping_description') ||
                'Manage role-to-permission mappings for the Admin UI'}
            </Typography>
          </Box>

          <Alert
            severity="info"
            icon={<InfoOutlined />}
            sx={{
              'mb': 3,
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <Typography variant="body2">
              {t('documentation.mappings.note_prefix')}{' '}
              <Link to="/adm/cedarlingconfig" style={{ fontWeight: 500 }}>
                Cedarling
              </Link>{' '}
              {t('documentation.mappings.note_suffix')}
            </Typography>
          </Alert>

          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t('messages.error_loading_mapping')}
            </Alert>
          )}

          <GluuViewWrapper canShow={canReadMapping}>
            <Box sx={{ mt: 1 }}>{mappingList}</Box>
          </GluuViewWrapper>
        </CardBody>
      </Card>
    </GluuLoader>
  )
})

export default MappingPage
