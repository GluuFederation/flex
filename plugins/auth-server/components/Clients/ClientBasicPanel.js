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
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from '../../../../app/routes/Apps/Gluu/GluuToogleRow'
import GluuTypeAhead from '../../../../app/routes/Apps/Gluu/GluuTypeAhead'
import GluuTypeAheadForDn from '../../../../app/routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuTypeAheadWithAdd from '../../../../app/routes/Apps/Gluu/GluuTypeAheadWithAdd'
import GluuTooltip from '../../../../app/routes/Apps/Gluu/GluuTooltip'
import DatePicker from 'react-datepicker'
import { useTranslation } from 'react-i18next'
const DOC_CATEGORY = 'openid_client'

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
        <GluuTooltip doc_category={DOC_CATEGORY} doc_entry="inum">
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
        </GluuTooltip>
      )}
      <GluuInputRow
        label="fields.client_name"
        name="clientName"
        formik={formik}
        value={client.clientName || client.displayName}
        doc_category={DOC_CATEGORY}
      />
      <GluuTooltip doc_category={DOC_CATEGORY} doc_entry="client_secret">
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
      </GluuTooltip>
      <GluuInputRow
        label="fields.description"
        name="description"
        formik={formik}
        value={client.description}
        doc_category={DOC_CATEGORY}
      />
      <GluuToogleRow
        name="disabled"
        formik={formik}
        label="fields.is_active"
        value={!client.disabled}
        doc_category={DOC_CATEGORY}
      />
      <GluuToogleRow
        name="expirable"
        formik={formik}
        label="fields.is_expirable_client"
        value={expirable}
        handler={handleExpirable}
        doc_category={DOC_CATEGORY}
      />

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

      <GluuInputRow
        label="fields.policy_uri"
        name="policyUri"
        formik={formik}
        value={client.policyUri}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.logo_uri"
        name="logoUri"
        formik={formik}
        value={client.logoUri}
        doc_category={DOC_CATEGORY}
      />
      <GluuInputRow
        label="fields.sector_uri"
        name="sectorIdentifierUri"
        formik={formik}
        value={client.sectorIdentifierUri}
        doc_category={DOC_CATEGORY}
      />
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
        doc_category={DOC_CATEGORY}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="responseTypes"
        label="fields.response_types"
        formik={formik}
        value={client.responseTypes}
        options={responseTypes}
        doc_category={DOC_CATEGORY}
      ></GluuTypeAhead>
      <GluuTypeAheadForDn
        name="scopes"
        label="fields.scopes"
        formik={formik}
        value={getScopeMapping(client.scopes, scopes)}
        options={scopes}
        doc_category={DOC_CATEGORY}
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
        doc_category={DOC_CATEGORY}
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
        doc_category={DOC_CATEGORY}
      ></GluuTypeAheadWithAdd>

      <FormGroup row>
        <Col sm={6}>
          <GluuToogleRow
            name="persistClientAuthorizations"
            lsize={9}
            rsize={3}
            formik={formik}
            label="fields.persist_client_authorizations"
            value={client.persistClientAuthorizations}
            doc_category={DOC_CATEGORY}
          />
        </Col>
        <Col sm={6}>
          <GluuToogleRow
            name="trustedClient"
            lsize={9}
            rsize={3}
            formik={formik}
            label="fields.is_trusted_client"
            value={client.trustedClient}
            doc_category={DOC_CATEGORY}
          />
        </Col>
      </FormGroup>
    </Container>
  )
}

export default ClientBasicPanel
