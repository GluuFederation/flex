import React, { useCallback, useState, useEffect } from 'react'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { FormGroup } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import spec from '../../../../../configApiSpecs.yaml'
import { buildPayload, API_CONFIG_WRITE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { patchApiConfigConfiguration } from 'Plugins/auth-server/redux/features/configApiSlice'
import JsonPropertyBuilderConfigApi from './JsonPropertyBuilderConfigApi'
import { toast } from 'react-toastify'

const schema = spec.components.schemas.ApiAppConfiguration.properties

const ApiConfigForm = () => {
  const { hasCedarPermission, authorize } = useCedarling()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState([])
  const [operations, setOperations] = useState([])

  const configuration = useSelector((state) => state.configApiReducer.configuration)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  const userAction = {}

  // Permission initialization
  useEffect(() => {
    const authorizePermissions = async () => {
      try {
        await authorize([API_CONFIG_WRITE])
      } catch (error) {
        console.error('Error authorizing API config permissions:', error)
      }
    }

    authorizePermissions()
  }, [])

  useEffect(() => {}, [cedarPermissions])

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

  const handleBack = () => {
    navigate('/home/dashboard')
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
      {hasCedarPermission(API_CONFIG_WRITE) && (
        <GluuCommitFooter
          saveHandler={toggle}
          hideButtons={{ back: false }}
          backButtonLabel="Back"
          backButtonHandler={handleBack}
        />
      )}

      {hasCedarPermission(API_CONFIG_WRITE) && (
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
