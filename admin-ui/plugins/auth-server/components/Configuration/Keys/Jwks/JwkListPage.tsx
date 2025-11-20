import React, { useMemo } from 'react'
import { Card, CardBody, Alert } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import JwkItem from './JwkItem'
import { useJwkApi } from '../hooks'
import { useTranslation } from 'react-i18next'

const generateStableKey = (kid: string | undefined, index: number): string => {
  return kid || `jwk-${index}`
}

/**
 * Render the JSON Web Key Set (JWKS) section, handling loading, error, and empty states.
 *
 * @returns The component's React element containing the JWKS section: a loading wrapper while fetching, an error alert if loading fails, the list of JWK items when present, or an informational alert when no keys are found.
 */
function JwkListPage(): React.ReactElement {
  const { t } = useTranslation()
  const { jwks, isLoading, error } = useJwkApi()

  const jwkItems = useMemo(() => {
    if (!jwks?.keys || jwks.keys.length === 0) {
      return null
    }

    return jwks.keys.map((item, index) => (
      <JwkItem key={generateStableKey(item.kid, index)} item={item} index={index} />
    ))
  }, [jwks?.keys])

  if (error) {
    return (
      <>
        <GluuLabel label="fields.json_web_keys" size={3} />
        <Card>
          <CardBody>
            <Alert color="danger">
              <h4 className="alert-heading">{t('messages.error')}</h4>
              <p>{error.message || t('messages.error_loading_jwks')}</p>
            </Alert>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <GluuLoader blocking={isLoading}>
      <GluuLabel label="fields.json_web_keys" size={3} />
      <Card>
        <CardBody>
          {jwkItems || (
            <Alert color="info">
              <p>{t('messages.no_jwks_found')}</p>
            </Alert>
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

JwkListPage.displayName = 'JwkListPage'

export default JwkListPage