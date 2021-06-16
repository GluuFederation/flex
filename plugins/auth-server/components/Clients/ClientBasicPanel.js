import React, { useState } from 'react'
import {
  Col,
  Container,
  FormGroup,
  Input,
  InputGroup,
  CustomInput,
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuTypeAhead from '../../../../app/routes/Apps/Gluu/GluuTypeAhead'
import GluuTypeAheadForDn from '../../../../app/routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuTypeAheadWithAdd from '../../../../app/routes/Apps/Gluu/GluuTypeAheadWithAdd'
import DatePicker from 'react-datepicker'
import { useTranslation } from 'react-i18next'

const ClientBasicPanel = ({ client, scopes, formik }) => {
  const { t } = useTranslation()
  const uri_id = 'redirect_uri'
  const post_uri_id = 'post_uri_id'
  const grantTypes = [
    'authorization_code',
    'implicit',
    'refresh_token',
    'client_credentials',
    'password',
    'urn:ietf:params:oauth:grant-type:uma-ticket',
  ]
  const responseTypes = ['code', 'token', 'id_token']
  const postLogoutRedirectUris = []
  const redirectUris = []
  const [expirable, setExpirable] = useState(
    client.expirationDate ? client.expirationDate : false,
  )
  const [expDate, setExpDate] = useState(
    client.expirationDate ? new Date(client.expirationDate) : new Date(),
  )

  function handleExpirable() {
    setExpirable(!expirable)
  }

  function extractDescription(customAttributes) {
    var result = customAttributes.filter((item) => item.name === 'description')
    if (result && result.length >= 1) {
      return result[0].values
    }
    return ''
  }
  function getScopeMapping(exitingScopes, scopes) {
    if (!exitingScopes) {
      exitingScopes = []
    }
    return scopes.filter((item) => exitingScopes.includes(item.dn))
  }

  function uriValidator(uri) {
    return (
      uri.startsWith('https://') ||
      uri.startsWith('schema://') ||
      uri.startsWith('appschema://')
    )
  }
  function postUriValidator(uri) {
    return uri.startsWith('https://')
  }

  return (
    <Container>
      {client.inum && (
        <FormGroup row>
          <GluuLabel label={t("fields.inum")} />
          <Col sm={9}>
            <Input
              style={{ backgroundColor: '#F5F5F5' }}
              id="inum"
              name="inum"
              disabled
              value={client.inum}
            />
          </Col>
        </FormGroup>
      )}
      <FormGroup row>
        <GluuLabel label={t("fields.client_secret")} />
        <Col sm={9}>
          <Input
            id="clientSecret"
            name="clientSecret"
            type="password"
            defaultValue={client.clientSecret}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("fields.client_name")} />
        <Col sm={9}>
          <Input
            placeholder={t("Enter the client name")}
            id="clientName"
            name="clientName"
            defaultValue={client.clientName || client.displayName}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("fields.description")} />
        <Col sm={9}>
          <Input
            placeholder={t("Enter the client description")}
            id="description"
            name="description"
            defaultValue={extractDescription(client.customAttributes || [])}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("fields.is_expirable_client")} size={4} />
        <Col sm={8}>
          <Input
            id="expirable"
            label={t("Expirable client?")}
            type="checkbox"
            onChange={handleExpirable}
            defaultChecked={expirable}
          />
        </Col>
      </FormGroup>
      {expirable && (
        <FormGroup row>
          <GluuLabel label={t("client_expiration_date")} size={5} />

          <Col sm={7}>
            <DatePicker
              id="expirationDate"
              name="expirationDate"
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm:aa"
              timeFormat="HH:mm:aa"
              selected={expDate}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              onChange={(date) => setExpDate(date)}
            />
          </Col>
        </FormGroup>
      )}
      <FormGroup row>
        <GluuLabel label={t("Logo URI")} />
        <Col sm={9}>
          <Input
            placeholder={t("Enter the logo uri")}
            id="logoURI"
            name="logoURI"
            defaultValue={client.logoUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("Policy URI")} />
        <Col sm={9}>
          <Input
            placeholder={t("Enter the policy uri")}
            id="policyUri"
            name="policyUri"
            defaultValue={client.policyUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("Sector URI")} />
        <Col sm={9}>
          <Input
            placeholder={t("Enter the sector uri")}
            id="sectorIdentifierUri"
            name="sectorIdentifierUri"
            defaultValue={client.sectorIdentifierUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label={t("Application Type")} />
        <Col sm={3}>
          <InputGroup>
            <CustomInput
              type="select"
              id="applicationType"
              name="applicationType"
              defaultValue={client.applicationType}
              onChange={formik.handleChange}
            >
              <option value="">{t("Choose")}...</option>
              <option>{t("web")}</option>
              <option>{("native")}</option>
            </CustomInput>
          </InputGroup>
        </Col>
        <GluuLabel label={t("Subject Type")} />
        <Col sm={3}>
          <InputGroup>
            <CustomInput
              type="select"
              id="subjectType"
              name="subjectType"
              defaultValue={client.subjectType}
              onChange={formik.handleChange}
            >
              <option value="">{t("Choose")}...</option>
              <option>{t("pairwise")}</option>
              <option>{t("public")}</option>
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>

      <GluuTypeAhead
        name="grantTypes"
        label={t("Grant Types")}
        formik={formik}
        value={client.grantTypes}
        options={grantTypes}
      ></GluuTypeAhead>

      <GluuTypeAhead
        name="responseTypes"
        label={t("Responses Types")}
        formik={formik}
        value={client.responseTypes}
        options={responseTypes}
      ></GluuTypeAhead>
      <GluuTypeAheadForDn
        name="scopes"
        label={t("Scopes")}
        formik={formik}
        value={getScopeMapping(client.scopes, scopes)}
        options={scopes}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadWithAdd
        name="postLogoutRedirectUris"
        label={t("Post Logout RedirectUris")}
        formik={formik}
        placeholder={t("Enter a post redirect uri with pattern")+" https://"}
        value={client.postLogoutRedirectUris || []}
        options={postLogoutRedirectUris}
        validator={postUriValidator}
        inputId={post_uri_id}
      ></GluuTypeAheadWithAdd>

      <GluuTypeAheadWithAdd
        name="redirectUris"
        label={t("Redirect Uris")}
        formik={formik}
        placeholder={t("Enter a redirect uri with pattern")+" https:// "+t("or")+" schema://"}
        value={client.redirectUris || []}
        options={redirectUris}
        validator={uriValidator}
        inputId={uri_id}
      ></GluuTypeAheadWithAdd>

      <FormGroup row>
        <GluuLabel label={t("Persist Client Authorizations")} size={3} />
        <Col sm={1}>
          <Input
            id="persistClientAuthorizations"
            name="persistClientAuthorizations"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.persistClientAuthorizations}
          />
        </Col>
        <GluuLabel label={t("Is Active")} size={3} />
        <Col sm={1}>
          <Input
            id="disabled"
            name="disabled"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={!client.disabled}
          />
        </Col>
        <GluuLabel label={t("Pre-Authorization")} size={3} />
        <Col sm={1}>
          <Input
            id="trustedClient"
            name="trustedClient"
            onChange={formik.handleChange}
            type="checkbox"
            defaultChecked={client.trustedClient}
          />
        </Col>
      </FormGroup>
    </Container>
  )
}

export default ClientBasicPanel
