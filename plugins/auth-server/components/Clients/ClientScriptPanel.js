import React from 'react'
import { Container } from '../../../../app/components'
import GluuTypeAheadForDn from '../../../../app/routes/Apps/Gluu/GluuTypeAheadForDn'

function ClientScriptPanel({ client, scopes, scripts, formik }) {
  const postScripts = scripts
    .filter((item) => item.scriptType == 'POST_AUTHN')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const spontaneousScripts = scripts
    .filter((item) => item.scriptType == 'SPONTANEOUS_SCOPE')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const consentScripts = scripts
    .filter((item) => item.scriptType == 'CONSENT_GATHERING')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const instrospectionScripts = scripts
    .filter((item) => item.scriptType == 'INTROSPECTION')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const rptScripts = scripts
    .filter((item) => item.scriptType == 'UMA_RPT_CLAIMS')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  return (
    <Container>
      <GluuTypeAheadForDn
        name="postAuthnScripts"
        label="fields.post_authn_scripts"
        formik={formik}
        value={client.postAuthnScripts}
        options={postScripts}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="consentGatheringScripts"
        label="fields.consent_gathering_scripts"
        formik={formik}
        value={client.consentGatheringScripts}
        options={consentScripts}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="spontaneousScopeScriptDns"
        label="fields.spontaneous_scope_script_dns"
        formik={formik}
        value={client.spontaneousScopeScriptDns}
        options={spontaneousScripts}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="introspectionScripts"
        label="fields.introspection_scripts"
        formik={formik}
        value={client.introspectionScripts}
        options={instrospectionScripts}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="rptScripts"
        label="fields.rpt_scripts"
        formik={formik}
        value={client.rptClaimsScripts}
        options={rptScripts}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="spontaneousScopes"
        label="fields.spontaneous_scopes"
        formik={formik}
        value={client.spontaneousScopes}
        options={scopes}
      ></GluuTypeAheadForDn>
    </Container>
  )
}

export default ClientScriptPanel
