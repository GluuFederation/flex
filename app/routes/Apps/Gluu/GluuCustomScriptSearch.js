import React from 'react'
import {
  Input,
  InputGroup,
  CustomInput,
  FormGroup,
} from './../../../components'
import { useTranslation } from 'react-i18next'

function GluuCustomScriptSearch({
  handler,
  patternId,
  limitId,
  typeId,
  limit,
}) {
  const { t } = useTranslation()
  return (
    <FormGroup row style={{ marginTop: '10px' }}>
      <Input
        style={{ width: '80px' }}
        id={limitId}
        type="number"
        data-testid={limitId}
        onChange={handler}
        defaultValue={limit}
      />
      &nbsp;
      <InputGroup style={{ width: '210px' }}>
        <CustomInput type="select"   data-testid={typeId}  id={typeId} onChange={handler}>
          <option>PERSON_AUTHENTICATION</option>
          <option>INTROSPECTION</option>
          <option>RESOURCE_OWNER_PASSWORD_CREDENTIALS</option>
          <option>APPLICATION_SESSION</option>
          <option>CACHE_REFRESH</option>
          <option>UPDATE_USER</option>
          <option>USER_REGISTRATION</option>
          <option>CLIENT_REGISTRATION</option>
          <option>ID_GENERATOR</option>
          <option>UMA_RPT_POLICY</option>
          <option>UMA_RPT_CLAIMS</option>
          <option>UMA_CLAIMS_GATHERING</option>
          <option>CONSENT_GATHERING</option>
          <option>DYNAMIC_SCOPE</option>
          <option>SPONTANEOUS_SCOPE</option>
          <option>END_SESSION</option>
          <option>POST_AUTHN</option>
          <option>SCIM</option>
          <option>CIBA_END_USER_NOTIFICATION</option>
          <option>REVOKE_TOKEN</option>
          <option>PERSISTENCE_EXTENSION</option>
          <option>IDP</option>
          <option>UPDATE_TOKEN</option>
        </CustomInput>
      </InputGroup>
      &nbsp;
      <Input
        style={{ width: '180px' }}
        id={patternId}
        type="text"
        data-testid={patternId}
        onChange={handler}
        placeholder={t("placeholders.search_pattern")}
      />
    </FormGroup>
  )
}

export default GluuCustomScriptSearch
