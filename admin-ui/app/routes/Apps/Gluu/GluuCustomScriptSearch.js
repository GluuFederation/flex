import React from 'react'
import { Input, InputGroup, CustomInput, FormGroup } from 'Components'
import { useTranslation } from 'react-i18next'

function GluuCustomScriptSearch({
  handler,
  patternId,
  limitId,
  typeId,
  limit,
  scriptType,
  pattern = '',
}) {
  const { t } = useTranslation()
  return (
    <FormGroup row style={{ marginTop: '10px' }}>
      <InputGroup style={{ width: '210px' }}>
        <CustomInput
          type="select"
          name="type"
          data-testid={typeId}
          id={typeId}
          defaultValue={scriptType}
          onChange={handler}
          className="search-select"
        >
          <option value="person_authentication">PERSON_AUTHENTICATION</option>
          <option value="introspection">INTROSPECTION</option>
          <option value="resource_owner_password_credentials">RESOURCE_OWNER_PASSWORD_CREDENTIALS</option>
          <option value="application_session">APPLICATION_SESSION</option>
          <option value="cache_refresh">CACHE_REFRESH</option>
          <option value="client_registration">CLIENT_REGISTRATION</option>
          <option value="id_generator">ID_GENERATOR</option>
          <option value="uma_rpt_policy">UMA_RPT_POLICY</option>
          <option value="uma_rpt_claims">UMA_RPT_CLAIMS</option>
          <option value="uma_claims_gathering">UMA_CLAIMS_GATHERING</option>
          <option value="consent_gathering">CONSENT_GATHERING</option>
          <option value="dynamic_scope">DYNAMIC_SCOPE</option>
          <option value="spontaneous_scope">SPONTANEOUS_SCOPE</option>
          <option value="end_session">END_SESSION</option>
          <option value="post_authn">POST_AUTHN</option>
          <option value="scim">SCIM</option>
          <option value="ciba_end_user_notification">CIBA_END_USER_NOTIFICATION</option>
          <option value="revoke_token">REVOKE_TOKEN</option>
          <option value="persistence_extension">PERSISTENCE_EXTENSION</option>
          <option value="idp">IDP</option>
          <option value="discovery">DISCOVERY</option>
          <option value="update_token">UPDATE_TOKEN</option>
          <option value="config_api_auth">CONFIG_API_AUTH</option>
          <option value="modify_ssa_response">MODIFY_SSA_RESPONSE</option>
        </CustomInput>
      </InputGroup>
      &nbsp;
      <Input
        style={{ width: '180px' }}
        id={patternId}
        type="text"
        data-testid={patternId}
        name="pattern"
        onChange={handler}
        defaultValue={pattern}
        placeholder={t('placeholders.search_pattern')}
      />
    </FormGroup>
  )
}

export default GluuCustomScriptSearch
