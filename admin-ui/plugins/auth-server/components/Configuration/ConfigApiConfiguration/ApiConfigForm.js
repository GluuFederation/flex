import React, { useCallback, useState } from 'react'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { FormGroup } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import spec from '../../../../../configApiSpecs.yaml'
import { buildPayload, hasPermission, API_CONFIG_WRITE } from 'Utils/PermChecker'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { patchApiConfigConfiguration } from 'Plugins/auth-server/redux/features/configApiSlice'
import JsonPropertyBuilderConfigApi from './JsonPropertyBuilderConfigApi'
import { toast } from 'react-toastify'

const schema = spec.components.schemas.ApiAppConfiguration.properties

const ApiConfigForm = () => {
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState([])
  const [operations, setOperations] = useState([])

  const configuration = useSelector((state) => state.configApiReducer.configuration)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const userAction = {}

  const toggle = useCallback(() => {
    if (patches?.length > 0) {
      setModal(!modal)
    } else toast.error('No changes to update')
  }, [modal])

  const submitForm = useCallback((userMessage) => {
    toggle()

    handleSubmit(userMessage)
  }, [])

  const handleSubmit = (message) => {
    if (patches.length) {
      const postBody = {}
      postBody['requestBody'] = patches
      buildPayload(userAction, message, postBody)

      dispatch(patchApiConfigConfiguration({ action: userAction }))
    }
  }

  function generateLabel(name) {
    const result = name.replace(/([A-Z])/g, ' $1')
    return result.toLowerCase()
  }

  const patchHandler = (patch) => {
    setPatches((existingPatches) => [...existingPatches, patch])
    const newPatches = patches
    newPatches.push(patch)
    setPatches(newPatches)
    setOperations(newPatches)
  }

  return (
    <>
      {Object.keys(configuration).map((propKey) => {
        if (generateLabel(propKey)) {
          return (
            <JsonPropertyBuilderConfigApi
              key={propKey}
              propKey={propKey}
              propValue={configuration[propKey]}
              lSize={6}
              handler={patchHandler}
              schema={schema[propKey]}
              doc_category="config_api_properties"
            />
          )
        }
      })}

      <FormGroup row></FormGroup>
      {hasPermission(permissions, API_CONFIG_WRITE) && <GluuCommitFooter saveHandler={toggle} />}

      {hasPermission(permissions, API_CONFIG_WRITE) && (
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          operations={operations}
          onAccept={submitForm}
        />
      )}
    </>
  )
}

export default ApiConfigForm
