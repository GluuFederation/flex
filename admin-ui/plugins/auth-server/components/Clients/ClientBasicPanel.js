import React, { useCallback, useEffect, useState } from 'react'
import {
  Col,
  Container,
  FormGroup,
  Input,
  InputGroup,
  CustomInput,
} from 'Components'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useTranslation } from 'react-i18next'
import { getClientScopeByInum } from '../../../../app/utils/Util'
import { useDispatch, useSelector } from 'react-redux'
import { PER_PAGE_SCOPES } from '../../common/Constants'
import { getClientScopes } from '../../redux/actions/ScopeActions'
import { isEmpty } from 'lodash'
import _debounce from 'lodash/debounce'
import { getScopes } from 'Plugins/auth-server/redux/actions/ScopeActions'
const DOC_CATEGORY = 'openid_client'

const ClientBasicPanel = ({
  client,
  scopes,
  formik,
  oidcConfiguration,
  viewOnly,
}) => {
  const dispatch = useDispatch()
  const totalItems = useSelector((state) => state.scopeReducer.totalItems)
  const clientScopes = useSelector((state) => state.scopeReducer.clientScopes)?.map((item) => ({ dn: item.dn, name: item.id }))
  const isLoading = useSelector((state) => state.scopeReducer.loadingClientScopes)
  const scopeLoading = useSelector((state) => state.scopeReducer.loading)
  const clientScopeOptions = scopes?.filter(o1 => !clientScopes?.some(o2 => o1.dn === o2.dn))
  const scopeOptions = client.scopes?.length ? clientScopeOptions : scopes
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
  const tokenEndpointAuthMethod = !!oidcConfiguration.tokenEndpointAuthMethodsSupported
    ? oidcConfiguration.tokenEndpointAuthMethodsSupported
    : []
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
  const [userScopeAction] = useState({
    limit: PER_PAGE_SCOPES,
    pattern: "",
    startIndex: 0,
  })

  function uriValidator(uri) {
    return uri
  }
  function handleClickShowClientSecret() {
    setShowClientSecret(!showClientSecret)
  }

  function handleMouseDownClientSecret(event) {
    event.preventDefault()
  }

  useEffect(() => {
    const scopeInums = [];
    if (client.inum) {
      let userAction = {}
      for (const scope of client.scopes) {
        scopeInums.push(getClientScopeByInum(scope))
      }
      userAction["pattern"] = scopeInums.join(",")
      userAction["limit"] = PER_PAGE_SCOPES
      dispatch(getClientScopes(userAction))
    }
  }, [])

  const handlePagination = async (event, shownResults) => {
    userScopeAction['limit'] = PER_PAGE_SCOPES
    userScopeAction['startIndex'] = (userScopeAction['startIndex'] ?? 0) + 10
    if(!userScopeAction.pattern) {
      delete userScopeAction.pattern
    }
    if(!userScopeAction.startIndex) {
      delete userScopeAction.startIndex
    }
    if (totalItems + PER_PAGE_SCOPES > userScopeAction.limit) {
      dispatch(getScopes(userScopeAction))
    }
  };

  const debounceFn = useCallback(_debounce((query) => {
    const searchedScope = scopeOptions?.find((scope) => scope.name.includes(query))
    if (isEmpty(searchedScope)) {
      query && handleDebounceFn(query)
    }
  }, 500), [scopeOptions])

  function handleDebounceFn(inputValue) {
    userScopeAction['pattern'] = inputValue
    delete userScopeAction.startIndex
    dispatch(getScopes(userScopeAction))
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
                disabled={viewOnly}
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
        value={client.clientName}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <FormGroup row>
        <GluuLabel label="fields.client_secret" doc_category={DOC_CATEGORY} doc_entry="clientSecret" />
        <Col sm={9}>
          <div
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
            }}
          >
            <Input
              id="clientSecret"
              name="clientSecret"
              type={showClientSecret ? 'text' : 'password'}
              value={client.clientSecret}
              onChange={formik.handleChange}
              disabled={viewOnly}
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
      <GluuInputRow
        label="fields.description"
        name="description"
        formik={formik}
        value={client.description}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuSelectRow
        label="fields.token_endpoint_auth_method"
        formik={formik}
        value={client.tokenEndpointAuthMethod}
        values={tokenEndpointAuthMethod}
        lsize={3}
        rsize={9}
        name="tokenEndpointAuthMethod"
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />


      <FormGroup row>
        <GluuLabel label="fields.subject_type_basic" doc_category={DOC_CATEGORY} doc_entry="subjectType" />
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="subjectType"
              name="subjectType"
              disabled={viewOnly}
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
      <GluuInputRow
        label="fields.sector_uri"
        name="sectorIdentifierUri"
        formik={formik}
        value={client.sectorIdentifierUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuTypeAhead
        name="grantTypes"
        label="fields.grant_types"
        formik={formik}
        value={client.grantTypes}
        options={grantTypes}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="responseTypes"
        label="fields.response_types"
        formik={formik}
        value={client.responseTypes}
        options={responseTypes}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
      ></GluuTypeAhead>
      <FormGroup row>
        <Col sm={6}>
          <GluuToogleRow
            name="disabled"
            formik={formik}
            label="fields.is_active"
            value={!client.disabled}
            doc_category={DOC_CATEGORY}
            lsize={9}
            rsize={3}
            disabled={viewOnly}
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
            disabled={viewOnly}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.application_type" doc_category={DOC_CATEGORY} doc_entry="applicationType" />
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="applicationType"
              name="applicationType"
              defaultValue={client.applicationType}
              onChange={formik.handleChange}
              disabled={viewOnly}
            >
              <option value="">{t('actions.choose')}...</option>
              <option>web</option>
              <option>native</option>
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>
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
        lsize={3}
        rsize={9}
        disabled={viewOnly}
      ></GluuTypeAheadWithAdd>

      <GluuInputRow
        label="fields.redirectUrisRegex"
        name="redirectUrisRegex"
        formik={formik}
        value={client.redirectUrisRegex}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      {isLoading ? "Fetching Scopes..." :
        <GluuTypeAheadForDn
          name="scopes"
          label="fields.scopes"
          formik={formik}
          value={client.scopes?.length ? clientScopes : []}
          options={scopeOptions}
          doc_category={DOC_CATEGORY}
          lsize={3}
          rsize={9}
          disabled={viewOnly}
          paginate={totalItems >= PER_PAGE_SCOPES}
          onSearch={debounceFn}
          onPaginate={handlePagination}
          maxResults={scopeOptions?.length ? scopeOptions.length - 1 : undefined}
          isLoading={scopeLoading}
          placeholder="Search for a scope..."
        ></GluuTypeAheadForDn>
      }
    </Container>
  )
}

export default ClientBasicPanel
