import React from 'react'
import { Container } from '../../../../app/components'
import GluuTypeAheadForDn from '../../../../app/routes/Apps/Gluu/GluuTypeAheadForDn'
import { useTranslation } from 'react-i18next'

function ClientScriptPanel({ client, scopes, scripts, formik }) {
  const { t } = useTranslation()
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

  function getMapping(partial, total) {
    if (!partial) {
      partial = []
    }
    return total.filter((item) => partial.includes(item.dn))
  }

  return (
    <Container>
      <GluuTypeAheadForDn
        name="postAuthnScripts"
        label={t("Post Authn Scripts")}
        formik={formik}
        value={getMapping(client.attributes.postAuthnScripts, postScripts)}
        options={postScripts}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="consentGatheringScripts"
        label={t("Consent Gathering Scripts")}
        formik={formik}
        value={getMapping(
          client.attributes.consentGatheringScripts,
          consentScripts,
        )}
        options={consentScripts}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="spontaneousScopeScriptDns"
        label={t("Spontaneous Scope Script Dns")}
        formik={formik}
        value={getMapping(
          client.attributes.spontaneousScopeScriptDns,
          spontaneousScripts,
        )}
        options={spontaneousScripts}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="introspectionScripts"
        label={t("Introspection Scripts")}
        formik={formik}
        value={getMapping(
          client.attributes.introspectionScripts,
          instrospectionScripts,
        )}
        options={instrospectionScripts}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="rptScripts"
        label={t("Rpt Scripts")}
        formik={formik}
        value={getMapping(client.attributes.rptClaimsScripts, rptScripts)}
        options={rptScripts}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadForDn
        name="spontaneousScopes"
        label={t("Spontaneous Scopes")}
        formik={formik}
        value={getMapping(client.attributes.spontaneousScopes, scopes)}
        options={scopes}
      ></GluuTypeAheadForDn>
    </Container>
  )
}

export default ClientScriptPanel
