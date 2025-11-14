import React, { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FormGroup, Card, CardBody, CardHeader } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import PropertyBuilder from './JsonPropertyBuilder'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import RefreshIcon from '@mui/icons-material/Refresh'
import spec from '../../../../configApiSpecs.yaml'
import { buildPayload } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { getJsonConfig, patchJsonConfig } from 'Plugins/auth-server/redux/features/jsonConfigSlice'
import SetTitle from 'Utils/SetTitle'
import DefaultAcrInput from './DefaultAcrInput'
import {
  SIMPLE_PASSWORD_AUTH,
  FETCHING_JSON_PROPERTIES,
} from 'Plugins/auth-server/common/Constants'
import { getAcrsConfig, editAcrs } from 'Plugins/auth-server/redux/features/acrSlice'
import { getScripts } from 'Redux/features/initSlice'
import customColors from '@/customColors'

function ConfigPage() {
  const { hasCedarWritePermission, authorizeHelper } = useCedarling()
  const configuration = useSelector((state) => state.jsonConfigReducer.configuration)
  const acrs = useSelector((state) => state.acrReducer.acrReponse)
  const scripts = useSelector((state) => state.initReducer.scripts)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { t } = useTranslation()
  const lSize = 6
  const userAction = {}

  const propertiesResourceId = ADMIN_UI_RESOURCES.AuthenticationServerConfiguration
  const propertiesScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[propertiesResourceId] || [],
    [propertiesResourceId],
  )

  const canWriteProperties = useMemo(
    () => hasCedarWritePermission(propertiesResourceId),
    [hasCedarWritePermission, propertiesResourceId],
  )

  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState([])
  const [operations, setOperations] = useState([])

  const [search, setSearch] = useState('')
  const [finalSearch, setFinalSearch] = useState('')
  const schema = spec.components.schemas.AppConfiguration.properties
  const properties = Object.keys(schema)
  const api_configurations = Object.keys(configuration)
  const missing_properties_data = properties.filter(
    (property) => !api_configurations.some((configuration) => configuration === property),
  )
  SetTitle(t('titles.jans_json_property'))

  const [put, setPut] = useState([])

  useEffect(() => {
    authorizeHelper(propertiesScopes)
  }, [authorizeHelper, propertiesScopes])
  const authScripts = scripts
    .filter((item) => item.scriptType == 'person_authentication')
    .filter((item) => item.enabled)
    .map((item) => item.name)

  authScripts.push(SIMPLE_PASSWORD_AUTH)

  useEffect(() => {
    buildPayload(userAction, FETCHING_JSON_PROPERTIES, {})
    dispatch(getJsonConfig({ action: userAction }))
    dispatch(getAcrsConfig())
    dispatch(getScripts({ action: userAction }))
  }, [])
  useEffect(() => {}, [cedarPermissions])

  const renamedFieldFromObject = (obj) => {
    const { discoveryDenyKeys, ...rest } = obj

    return {
      ...rest,
      'OpenID Configuration Response OP Metadata Suppression List': discoveryDenyKeys ?? [],
    }
  }
  function isRenamedKey(propKey) {
    const renamedKeys = ['OpenID Configuration Response OP Metadata Suppression List']

    return renamedKeys.includes(propKey)
  }

  const patchHandler = (patch) => {
    setPatches((existingPatches) => [...existingPatches, patch])
    const newPatches = patches
    newPatches.push(patch)
    setPatches(newPatches)
    setOperations(newPatches.concat(put))
  }
  const putHandler = (put) => {
    setPut(put)
    setOperations(patches.concat(put))
  }
  function submitForm(message) {
    toggle()
    handleSubmit(message)
  }
  const handleSubmit = (message) => {
    if (patches.length >= 0) {
      const postBody = {}
      postBody['requestBody'] = patches

      buildPayload(userAction, message, postBody)
      if (put) {
        const opts = {}
        opts['authenticationMethod'] = { defaultAcr: put.value || acrs.defaultAcr }
        dispatch(editAcrs({ data: opts }))
      }
      dispatch(patchJsonConfig({ action: userAction }))
    }
  }
  function toggle() {
    setModal(!modal)
  }

  function generateLabel(name) {
    const result = name.replace(/([A-Z])/g, ' $1')
    return result.toLowerCase()
  }

  const handleBack = () => {
    navigate('/home/dashboard')
  }

  return (
    <GluuLoader blocking={!(!!configuration && Object.keys(configuration).length > 0)}>
      <Card style={{ borderRadius: 24 }}>
        <CardHeader>
          <div style={{ display: 'flex' }}>
            {/* Div For title if needed in future */}
            <div style={{ flex: 2 }}></div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </div>
              <div style={{ paddingLeft: 5 }}>
                <RefreshIcon
                  onClick={() => setFinalSearch(search.toLowerCase())}
                  style={{ cursor: 'pointer', color: customColors.lightBlue }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody style={{ minHeight: 500 }}>
          {Object.keys(configuration).length > 0 &&
            Object.entries(renamedFieldFromObject(configuration)).map(([propKey, propValue]) => {
              if (generateLabel(propKey).includes(finalSearch)) {
                return (
                  <PropertyBuilder
                    isRenamedKey={isRenamedKey(propKey)}
                    key={propKey}
                    propKey={propKey}
                    propValue={propValue}
                    lSize={lSize}
                    handler={patchHandler}
                    schema={schema[propKey]}
                  />
                )
              }
            })}

          {Object.keys(configuration).length > 0 &&
            missing_properties_data.map((propKey) => {
              if (generateLabel(propKey).includes(finalSearch)) {
                return (
                  <PropertyBuilder
                    key={propKey}
                    propKey={propKey}
                    lSize={lSize}
                    schema={schema[propKey]}
                    handler={patchHandler}
                  />
                )
              }
            })}
          {!!configuration && Object.keys(configuration).length > 0 && (
            <DefaultAcrInput
              id="defaultAcr"
              name="defaultAcr"
              lsize={lSize}
              rsize={lSize}
              type="select"
              label={t('fields.default_acr')}
              handler={putHandler}
              value={acrs?.defaultAcr}
              options={authScripts}
              path={'/ACR'}
            />
          )}

          <FormGroup row></FormGroup>
          {canWriteProperties && (
            <GluuCommitFooter
              saveHandler={toggle}
              hideButtons={{ back: false }}
              backButtonLabel="Back"
              backButtonHandler={handleBack}
            />
          )}
          <FormGroup row></FormGroup>
          <FormGroup row></FormGroup>
          <FormGroup row></FormGroup>
          {canWriteProperties && (
            <GluuCommitDialog
              handler={toggle}
              modal={modal}
              operations={operations}
              onAccept={submitForm}
            />
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ConfigPage
