import React, { useCallback, useState, useEffect } from 'react'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { FormGroup } from 'Components'
import { useNavigate } from 'react-router-dom'
import spec from '../../../../../configApiSpecs.yaml'
import { API_CONFIG_WRITE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import JsonPropertyBuilderConfigApi from './JsonPropertyBuilderConfigApi'
import { toast } from 'react-toastify'
import type { ApiAppConfiguration, JsonPatch } from './types'

interface ApiConfigFormProps {
  configuration: ApiAppConfiguration
  onSubmit: (patches: JsonPatch[], message: string) => Promise<void>
}

interface SpecSchema {
  components: {
    schemas: {
      ApiAppConfiguration: {
        properties: Record<string, unknown>
      }
    }
  }
}

const { properties: schema } = (spec as unknown as SpecSchema).components?.schemas
  ?.ApiAppConfiguration ?? { properties: {} }

const ApiConfigForm: React.FC<ApiConfigFormProps> = ({ configuration, onSubmit }) => {
  const { hasCedarPermission, authorize } = useCedarling()
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState<JsonPatch[]>([])

  const operations = patches

  useEffect(() => {
    const authorizePermissions = async () => {
      try {
        await authorize([API_CONFIG_WRITE])
      } catch (error) {
        console.error('Error authorizing API config permissions:', error)
      }
    }

    authorizePermissions()
  }, [authorize])

  const toggle = useCallback(() => {
    if (patches?.length > 0) {
      setModal((prev) => !prev)
    } else {
      toast.error('No changes to update')
    }
  }, [patches])

  const submitForm = useCallback(
    async (userMessage: string) => {
      toggle()
      await onSubmit(patches, userMessage)
    },
    [toggle, onSubmit, patches],
  )

  function generateLabel(name: string): string {
    const result = name.replace(/([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
  }

  const patchHandler = (patch: JsonPatch) => {
    setPatches((existingPatches) => [...existingPatches, patch])
  }

  const handleBack = () => {
    navigate('/home/dashboard')
  }

  return (
    <>
      {Object.keys(configuration).map((propKey) => (
        <JsonPropertyBuilderConfigApi
          key={propKey}
          propKey={propKey}
          propValue={configuration[propKey as keyof ApiAppConfiguration]}
          lSize={6}
          handler={patchHandler}
          schema={schema[propKey] as { type?: string; items?: { type?: string; enum?: string[] } }}
          doc_category="config_api_properties"
        />
      ))}

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
