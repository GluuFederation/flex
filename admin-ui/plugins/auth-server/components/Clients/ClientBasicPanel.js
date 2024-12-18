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
import _debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import { getScopes, getClientScopes, setClientSelectedScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
const DOC_CATEGORY = 'openid_client'

const grantTypes = [
  'authorization_code',
  'implicit',
  'refresh_token',
  'client_credentials',
  'password',
  'urn:ietf:params:oauth:grant-type:uma-ticket',
]

const responseTypes = ['code', 'token', 'id_token']
const uri_id = 'redirect_uri'

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
  const selectedClientScopes = useSelector((state) => state.scopeReducer.selectedClientScopes)
  const isLoading = useSelector((state) => state.scopeReducer.loadingClientScopes)
  const scopeLoading = useSelector((state) => state.scopeReducer.loading)
  const clientScopeOptions = scopes?.filter(o1 => !clientScopes?.some(o2 => o1.dn === o2.dn))
  const scopeOptions = client?.scopes?.length ? clientScopeOptions : scopes
  const { t } = useTranslation()

  const tokenEndpointAuthMethod = !!oidcConfiguration?.tokenEndpointAuthMethodsSupported
    ? oidcConfiguration.tokenEndpointAuthMethodsSupported
    : []

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
      if(client?.scopes?.length) {
        for (const scope of client.scopes) {
          scopeInums.push(getClientScopeByInum(scope))
        }
      }
      userAction["pattern"] = scopeInums.join(",")
      userAction["limit"] = PER_PAGE_SCOPES
      dispatch(getClientScopes({ action: userAction }))
    }
  }, [])

  const handlePagination = (event, shownResults) => {
    userScopeAction['limit'] = PER_PAGE_SCOPES
    userScopeAction['startIndex'] = 0
    if(!userScopeAction.pattern) {
      delete userScopeAction.pattern
    }
    if(!userScopeAction.startIndex) {
      delete userScopeAction.startIndex
    }
    if (totalItems + PER_PAGE_SCOPES > userScopeAction.limit) {
      dispatch(getScopes({ action: userScopeAction }))
    }
  };

  const debounceFn = useCallback(_debounce((query) => {
    query && handleDebounceFn(query)
  }, 500), [])

  function handleDebounceFn(inputValue) {
    userScopeAction['pattern'] = inputValue
    delete userScopeAction.startIndex
    dispatch(getScopes({ action: userScopeAction }))
  }

  const saveSelectedScopes = (scopes) => {
    dispatch(setClientSelectedScopes(scopes))
  }
  const defaultScopeValue = client?.scopes?.length ? clientScopes : []
  const scopeFieldValue = selectedClientScopes?.length ? selectedClientScopes : defaultScopeValue

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
                defaultValue={client.inum}
                readOnly={viewOnly}
              />
            </Col>
          </FormGroup>
        </GluuTooltip>
      )}
      <GluuInputRow
        label="fields.client_name"
        name="clientName"
        formik={formik}
        value={formik.values.clientName}
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
              value={formik.values.clientSecret}
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
        value={formik.values.description}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuSelectRow
        label="fields.token_endpoint_auth_method"
        formik={formik}
        value={formik.values.tokenEndpointAuthMethod}
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
              defaultValue={formik.values.subjectType}
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
        value={formik.values.sectorIdentifierUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuTypeAhead
        name="grantTypes"
        label="fields.grant_types"
        formik={formik}
        value={formik.values.grantTypes}
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
        value={formik.values.responseTypes}
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
            handler={(event) => {
              formik.setFieldValue('disabled', !event?.target?.checked)
            }}
            label="fields.is_active"
            value={!formik.values.disabled}
            doc_category={DOC_CATEGORY}
            lsize={6}
            rsize={3}
            disabled={viewOnly}
          />
        </Col>
        <Col sm={6}>
          <GluuToogleRow
            name="trustedClient"
            lsize={6}
            rsize={3}
            formik={formik}
            label="fields.is_trusted_client"
            value={formik.values.trustedClient}
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
              defaultValue={formik.values.applicationType}
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
        value={formik.values.redirectUris || []}
        options={[]}
        validator={uriValidator}
        inputId={uri_id}
        doc_category={DOC_CATEGORY}
        multiple={false}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
      ></GluuTypeAheadWithAdd>

      <GluuInputRow
        label="fields.redirectUrisRegex"
        name="attributes.redirectUrisRegex"
        formik={formik}
        value={formik.values?.attributes?.redirectUrisRegex}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      {isLoading ? "Fetching Scopes..." :
        <GluuTypeAheadForDn
          name="scopes"
          label="fields.scopes"
          formik={formik}
          value={scopeFieldValue}
          options={scopeOptions}
          doc_category={DOC_CATEGORY}
          lsize={3}
          rsize={9}
          disabled={viewOnly}
          onChange={saveSelectedScopes}
          paginate={true}
          onSearch={debounceFn}
          onPaginate={handlePagination}
          maxResults={scopeOptions?.length ? scopeOptions.length - 1 : undefined}
          isLoading={scopeLoading}
          defaultSelected={scopeFieldValue}
          placeholder="Search for a scope..."
        ></GluuTypeAheadForDn>
      }
    </Container>
  )
}

export default ClientBasicPanel
ClientBasicPanel.propTypes = {
  formik: PropTypes.any,
  client: PropTypes.any,
  scopes: PropTypes.any,
  viewOnly: PropTypes.bool,
  oidcConfiguration: PropTypes.any,
}
