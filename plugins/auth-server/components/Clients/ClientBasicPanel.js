import React, { useState } from 'react'
import {
  Col,
  Container,
  FormGroup,
  Input,
  InputGroup,
  CustomInput,
} from '../../../../app/components'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import GluuToogle from '../../../../app/routes/Apps/Gluu/GluuToogle'
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
  const [showClientSecret, setShowClientSecret] = useState(false)

  function handleExpirable() {
    setExpirable(!expirable)
  }

  function getScopeMapping(exitingScopes, scopes) {
    if (!exitingScopes) {
      exitingScopes = []
    }
    return scopes.filter((item) => exitingScopes.includes(item.dn))
  }

  function uriValidator(uri) {
    return uri
  }
  function postUriValidator(uri) {
    return uri
  }
  function handleClickShowClientSecret() {
    setShowClientSecret(!showClientSecret)
  }

  function handleMouseDownClientSecret(event) {
    event.preventDefault()
  }

  return (
    <Container>
      {client.inum && (
        <FormGroup row>
          <GluuLabel label="fields.inum" />
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
        <GluuLabel label="fields.client_name" />
        <Col sm={9}>
          <Input
            placeholder={t('placeholders.client_name')}
            id="clientName"
            name="clientName"
            defaultValue={client.clientName || client.displayName}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.client_secret" />
        <Col sm={9}>
          <div
            style={{
              height: '0.01em',
              display: 'flex',
              maxHeight: '2em',
              whiteSpace: 'nowrap',
            }}
          >
            <Input
              id="clientSecret"
              name="clientSecret"
              type={showClientSecret ? 'text' : 'password'}
              defaultValue={client.clientSecret}
              onChange={formik.handleChange}
            />
            <IconButton
              onClick={handleClickShowClientSecret}
              onMouseDown={handleMouseDownClientSecret}
            >
              {showClientSecret ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </div>
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.description" />
        <Col sm={9}>
          <Input
            placeholder={t('placeholders.client_description')}
            id="description"
            name="description"
            defaultValue={client.description}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.is_active" size={3} />
        <Col sm={9}>
          <GluuToogle
            id="disabled"
            name="disabled"
            formik={formik}
            value={!client.disabled}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.is_expirable_client" size={3} />
        <Col sm={9}>
          <GluuToogle
            id="expirable"
            name="expirable"
            handler={handleExpirable}
            formik={formik}
            value={expirable}
          />
        </Col>
      </FormGroup>
      {expirable && (
        <FormGroup row>
          <GluuLabel label="client_expiration_date" size={5} />
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
        <GluuLabel label="fields.policy_uri" />
        <Col sm={9}>
          <Input
            placeholder={t('placeholders.policy_uri')}
            id="policyUri"
            name="policyUri"
            defaultValue={client.policyUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.sector_uri" />
        <Col sm={9}>
          <Input
            placeholder={t('placeholders.sector_uri')}
            id="sectorIdentifierUri"
            name="sectorIdentifierUri"
            defaultValue={client.sectorIdentifierUri}
            onChange={formik.handleChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.application_type" />
        <Col sm={3}>
          <InputGroup>
            <CustomInput
              type="select"
              id="applicationType"
              name="applicationType"
              defaultValue={client.applicationType}
              onChange={formik.handleChange}
            >
              <option value="">{t('actions.choose')}...</option>
              <option>web</option>
              <option>native</option>
            </CustomInput>
          </InputGroup>
        </Col>
        <GluuLabel label="fields.subject_type" />
        <Col sm={3}>
          <InputGroup>
            <CustomInput
              type="select"
              id="subjectType"
              name="subjectType"
              defaultValue={client.subjectType}
              onChange={formik.handleChange}
            >
              <option value="">{t('actions.choose')}...</option>
              <option>pairwise</option>
              <option>public</option>
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>

      <GluuTypeAhead
        name="grantTypes"
        label="fields.grant_types"
        formik={formik}
        value={client.grantTypes}
        options={grantTypes}
      ></GluuTypeAhead>

      <GluuTypeAhead
        name="responseTypes"
        label="fields.response_types"
        formik={formik}
        value={client.responseTypes}
        options={responseTypes}
      ></GluuTypeAhead>
      <GluuTypeAheadForDn
        name="scopes"
        label="fields.scopes"
        formik={formik}
        value={getScopeMapping(client.scopes, scopes)}
        options={scopes}
      ></GluuTypeAheadForDn>
      <GluuTypeAheadWithAdd
        name="postLogoutRedirectUris"
        label="post_logout_redirect_uris"
        formik={formik}
        placeholder={t('placeholders.post_logout_redirect_uris')}
        value={client.postLogoutRedirectUris || []}
        options={postLogoutRedirectUris}
        validator={postUriValidator}
        inputId={post_uri_id}
      ></GluuTypeAheadWithAdd>

      <GluuTypeAheadWithAdd
        name="redirectUris"
        label="fields.redirect_uris"
        formik={formik}
        placeholder={t('placeholders.redirect_uris')}
        value={client.redirectUris || []}
        options={redirectUris}
        validator={uriValidator}
        inputId={uri_id}
      ></GluuTypeAheadWithAdd>

      <FormGroup row>
        <GluuLabel label="fields.persist_client_authorizations" size={4} />
        <Col sm={2}>
          <GluuToogle
            id="persistClientAuthorizations"
            name="persistClientAuthorizations"
            formik={formik}
            value={client.persistClientAuthorizations}
          />
        </Col>
        <GluuLabel label="fields.is_trusted_client" size={4} />
        <Col sm={2}>
          <GluuToogle
            id="trustedClient"
            name="trustedClient"
            formik={formik}
            value={client.trustedClient}
          />
        </Col>
      </FormGroup>
    </Container>
  )
}

export default ClientBasicPanel
