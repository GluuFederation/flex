import React from 'react'
import { Container } from 'Components'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import PropTypes from 'prop-types'

const DOC_CATEGORY = 'openid_client'

function ClientScriptPanel({ scripts, formik, viewOnly }) {
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
        name="attributes.spontaneousScopeScriptDns"
        label="fields.spontaneous_scopes"
        formik={formik}
        value={getMapping((formik.values?.attributes?.spontaneousScopeScriptDns || []),spontaneousScripts) || []}
        options={spontaneousScripts}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        defaultSelected={getMapping((formik.values?.attributes?.spontaneousScopeScriptDns || []),spontaneousScripts) || []}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="attributes.updateTokenScriptDns"
        label="fields.updateTokenScriptDns"
        formik={formik}
        value={getMapping((formik.values?.attributes?.updateTokenScriptDns || []), updateTokenScriptDns) || []}
        options={updateTokenScriptDns}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        defaultSelected={getMapping((formik.values?.attributes?.updateTokenScriptDns || []),updateTokenScriptDns) || []}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="attributes.postAuthnScripts"
        label="fields.post_authn_scripts"
        formik={formik}
        value={getMapping(formik.values?.attributes?.postAuthnScripts || [], postScripts) || []}
        options={postScripts}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        defaultSelected={getMapping((formik.values?.attributes?.postAuthnScripts || []),postScripts) || []}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="attributes.introspectionScripts"
        label="fields.introspection_scripts"
        formik={formik}
        value={getMapping((formik.values?.attributes?.introspectionScripts || []), instrospectionScripts) || []}
        options={instrospectionScripts}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        defaultSelected={getMapping((formik.values?.attributes?.introspectionScripts || []),instrospectionScripts) || []}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="attributes.ropcScripts"
        label="fields.ropcScripts"
        formik={formik}
        value={getMapping(formik.values?.attributes?.ropcScripts || [], ropcScripts) || []}
        options={ropcScripts}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        defaultSelected={getMapping((formik.values?.attributes?.ropcScripts || []),ropcScripts) || []}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="attributes.consentGatheringScripts"
        label="fields.consent_gathering_scripts"
        formik={formik}
        value={getMapping((formik.values?.attributes?.consentGatheringScripts || []), consentScripts) || []}
        options={consentScripts}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        defaultSelected={getMapping((formik.values?.attributes?.consentGatheringScripts || []),consentScripts) || []}
      ></GluuTypeAheadForDn>
    </Container>
  )
}

export default ClientScriptPanel
ClientScriptPanel.propTypes = {
  formik: PropTypes.any,
  scripts: PropTypes.any,
  viewOnly: PropTypes.bool
}
