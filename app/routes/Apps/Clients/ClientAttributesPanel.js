import React from 'react'
import { Container } from '../../../components'
import GluuBooleanSelectBox from '../Gluu/GluuBooleanSelectBox'

function ClientAttributesPanel({ client, formik }) {
  return (
    <Container>
      <GluuBooleanSelectBox
        name="runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims"
        label="Run Introspection Script Before AccessToken As Jwt Creation And Include Claims"
        value={
          client.attributes.runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims
        }
        formik={formik}
        lsize={8}
        rsize={4}
      />
      <GluuBooleanSelectBox
        name="keepClientAuthorizationAfterExpiration"
        label="Keep Client Authorization After Expiration"
        value={client.attributes.keepClientAuthorizationAfterExpiration}
        formik={formik}
        lsize={8}
        rsize={4}
      />
      <GluuBooleanSelectBox
        name="allowSpontaneousScopes"
        label="Allow Spontaneous Scopes"
        value={client.attributes.allowSpontaneousScopes}
        formik={formik}
        lsize={8}
        rsize={4}
      />
      <GluuBooleanSelectBox
        name="backchannelLogoutSessionRequired"
        label="Back Channel Logout Session Required"
        value={client.attributes.backchannelLogoutSessionRequired}
        formik={formik}
        lsize={8}
        rsize={4}
      />
    </Container>
  )
}

export default ClientAttributesPanel
