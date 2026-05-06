import React, { useMemo } from 'react'
import { Box } from '@mui/material'
import { InfoOutlined } from '@/components/icons'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import JwkItem from './JwkItem'
import { useJwkApi } from '../hooks'
import { useTranslation } from 'react-i18next'
import type { JwkListPageProps } from '../types'

const generateStableKey = (kid: string, index: number): string => {
  return kid || `jwk-${index}`
}

const JwkListPage: React.FC<JwkListPageProps> = ({ classes }) => {
  const { t } = useTranslation()
  const { jwks, isLoading, error } = useJwkApi()

  const jwkItems = useMemo(() => {
    if (!jwks?.keys || jwks.keys.length === 0) {
      return null
    }

    return jwks.keys.map((item, index) => {
      const kid = item.kid ?? ''
      return (
        <JwkItem key={generateStableKey(kid, index)} item={item} index={index} classes={classes} />
      )
    })
  }, [jwks?.keys, classes])

  if (error) {
    return (
      <Box className={classes.infoAlert}>
        <InfoOutlined className={classes.infoIcon} />
        <GluuText variant="span" className={classes.infoText} disableThemeColor>
          {error.message || t('messages.error_loading_jwks')}
        </GluuText>
      </Box>
    )
  }

  return (
    <GluuLoader blocking={isLoading}>
      <GluuText variant="h5" className={classes.sectionTitle}>
        {t('fields.json_web_keys')}
      </GluuText>
      {jwkItems || (
        <Box className={classes.infoAlert}>
          <InfoOutlined className={classes.infoIcon} />
          <GluuText variant="span" className={classes.infoText} disableThemeColor>
            {t('messages.no_jwks_found')}
          </GluuText>
        </Box>
      )}
    </GluuLoader>
  )
}

JwkListPage.displayName = 'JwkListPage'

export default JwkListPage
