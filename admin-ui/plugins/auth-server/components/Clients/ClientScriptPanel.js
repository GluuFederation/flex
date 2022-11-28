import React from 'react'
import { Container } from 'Components'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'

const DOC_CATEGORY = 'openid_client'

function ClientScriptPanel({ client, scripts, formik, viewOnly }) {
  const postScripts = scripts
    .filter((item) => item.scriptType == 'post_authn')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const spontaneousScripts = scripts
    .filter((item) => item.scriptType == 'spontaneous_scope')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const consentScripts = scripts
    .filter((item) => item.scriptType == 'consent_gathering')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  const instrospectionScripts = scripts
    .filter((item) => item.scriptType == 'introspection')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const ropcScripts = scripts
    .filter((item) => item.scriptType == 'resource_owner_password_credentials')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  const updateTokenScriptDns = scripts
    .filter((item) => item.scriptType == 'update_token')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))
  function getMapping(exiting, fullArray) {
    if (!exiting) {
      exiting = []
    }
    return fullArray.filter((item) => exiting.includes(item.dn))
  }

  return (
    <Container>
      <GluuTypeAheadForDn
        name="spontaneousScopeScriptDns"
        label="fields.spontaneous_scopes"
        formik={formik}
        value={getMapping(client?.spontaneousScopeScriptDns,spontaneousScripts)}
        options={spontaneousScripts}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="updateTokenScriptDns"
        label="fields.updateTokenScriptDns"
        formik={formik}
        value={getMapping(client?.updateTokenScriptDns, updateTokenScriptDns)}
        options={updateTokenScriptDns}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="postAuthnScripts"
        label="fields.post_authn_scripts"
        formik={formik}
        value={getMapping(client?.postAuthnScripts, postScripts)}
        options={postScripts}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="introspectionScripts"
        label="fields.introspection_scripts"
        formik={formik}
        value={getMapping(client?.introspectionScripts, instrospectionScripts)}
        options={instrospectionScripts}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="ropcScripts"
        label="fields.ropcScripts"
        formik={formik}
        value={getMapping(client?.ropcScripts, ropcScripts)}
        options={ropcScripts}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="consentGatheringScripts"
        label="fields.consent_gathering_scripts"
        formik={formik}
        value={getMapping(client?.consentGatheringScripts, consentScripts)}
        options={consentScripts}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      ></GluuTypeAheadForDn>
    </Container>
  )
}

export default ClientScriptPanel
