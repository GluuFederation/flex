import React, { useCallback, useState, useEffect, useMemo } from 'react'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { FormGroup } from 'Components'
import spec from '../../../../../configApiSpecs.yaml'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import JsonPropertyBuilderConfigApi from './JsonPropertyBuilderConfigApi'
import { toast } from 'react-toastify'
import type { ApiAppConfiguration, JsonPatch } from './types'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

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
  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
  const { navigateToRoute } = useAppNavigation()
  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState<JsonPatch[]>([])

  const operations = patches
  const configApiResourceId = ADMIN_UI_RESOURCES.ConfigApiConfiguration
  const configApiScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[configApiResourceId] || [],
    [configApiResourceId],
  )

  const canWriteConfigApi = useMemo(
    () => hasCedarWritePermission(configApiResourceId),
    [hasCedarWritePermission, configApiResourceId],
  )

  useEffect(() => {
    if (configApiScopes && configApiScopes.length > 0) {
      authorizeHelper(configApiScopes)
    }
  }, [authorizeHelper, configApiScopes])

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

  const patchHandler = (patch: JsonPatch) => {
    setPatches((existingPatches) => [...existingPatches, patch])
  }

  const handleBack = () => {
    navigateToRoute(ROUTES.HOME_DASHBOARD)
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

      <FormGroup row />
      {canWriteConfigApi && (
        <GluuCommitFooter
          saveHandler={toggle}
          hideButtons={{ back: false }}
          backButtonLabel="Back"
          backButtonHandler={handleBack}
        />
      )}

      {canWriteConfigApi && (
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
