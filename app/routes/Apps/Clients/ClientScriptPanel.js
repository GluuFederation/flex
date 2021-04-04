import React from 'react'
import { Container } from '../../../components'
import GluuTypeAhead from '../Gluu/GluuTypeAhead'

function ClientScriptPanel({ client, scopes, scripts, formik }) {
  const postScripts = scripts
    .filter((item) => item.scriptType == 'POST_AUTHN')
    .filter((item) => item.enabled)
    .map((item) => item.name)

  const spontaneousScripts = scripts
    .filter((item) => item.scriptType == 'SPONTANEOUS_SCOPE')
    .filter((item) => item.enabled)
    .map((item) => item.name)

  const consentScripts = scripts
    .filter((item) => item.scriptType == 'CONSENT_GATHERING')
    .filter((item) => item.enabled)
    .map((item) => item.name)

  const instrospectionScripts = scripts
    .filter((item) => item.scriptType == 'INTROSPECTION')
    .filter((item) => item.enabled)
    .map((item) => item.name)

  const rptScripts = scripts
    .filter((item) => item.scriptType == 'UMA_RPT_CLAIMS')
    .filter((item) => item.enabled)
    .map((item) => item.name)

  return (
    <Container>
      <GluuTypeAhead
        name="postAuthnScripts"
        label="Post Authn Scripts"
        formik={formik}
        value={client.postAuthnScripts}
        options={postScripts}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="consentGatheringScripts"
        label="Consent Gathering Scripts"
        formik={formik}
        value={client.consentGatheringScripts}
        options={consentScripts}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="spontaneousScopeScriptDns"
        label="Spontaneous Scope Script Dns"
        formik={formik}
        value={client.spontaneousScopeScriptDns}
        options={spontaneousScripts}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="introspectionScripts"
        label="Introspection Scripts"
        formik={formik}
        value={client.introspectionScripts}
        options={instrospectionScripts}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="rptScripts"
        label="Rpt Scripts"
        formik={formik}
        value={client.rptClaimsScripts}
        options={rptScripts}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="spontaneousScopes"
        label="Spontaneous Scopes"
        formik={formik}
        value={client.spontaneousScopes}
        options={scopes}
      ></GluuTypeAhead>
    </Container>
  )
}

export default ClientScriptPanel
