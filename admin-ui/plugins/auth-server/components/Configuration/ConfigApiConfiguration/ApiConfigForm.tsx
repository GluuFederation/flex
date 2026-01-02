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
import { READ_ONLY_FIELDS } from './utils'
import type { GluuCommitDialogOperation, JsonValue } from 'Routes/Apps/Gluu/types'

interface ApiConfigFormProps {
  configuration: ApiAppConfiguration
  onSubmit: (patches: JsonPatch[], message: string) => Promise<void>
}

interface SpecSchema {
  components: {
    schemas: {
      ApiAppConfiguration: {
        properties: Record<string, string | number | boolean | null | undefined>
      }
    }
  }
}

const { properties: schema } = (spec as unknown as SpecSchema).components?.schemas
  ?.ApiAppConfiguration ?? { properties: {} }

const CONFIG_API_RESOURCE_ID = ADMIN_UI_RESOURCES.ConfigApiConfiguration

const ApiConfigForm: React.FC<ApiConfigFormProps> = ({ configuration, onSubmit }) => {
  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
  const { navigateToRoute } = useAppNavigation()
  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState<JsonPatch[]>([])

  const configApiScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[CONFIG_API_RESOURCE_ID] || [], [])

  const canWriteConfigApi = useMemo(
    () => hasCedarWritePermission(CONFIG_API_RESOURCE_ID),
    [hasCedarWritePermission],
  )

  const operations: GluuCommitDialogOperation[] = useMemo(
    () =>
      patches.map((patch) => ({
        path: patch.path as string,
        value: patch.value as JsonValue,
      })),
    [patches],
  )

  useEffect(() => {
    if (configApiScopes && configApiScopes.length > 0) {
      authorizeHelper(configApiScopes)
    }
  }, [authorizeHelper, configApiScopes])

  const patchHandler = useCallback((patch: JsonPatch) => {
    setPatches((existingPatches) => [...existingPatches, patch])
  }, [])

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

  const handleBack = useCallback(() => {
    navigateToRoute(ROUTES.HOME_DASHBOARD)
  }, [navigateToRoute])

  return (
    <>
      {Object.keys(configuration).map((propKey) => {
        const isDisabled = READ_ONLY_FIELDS.includes(propKey)
        return (
          <JsonPropertyBuilderConfigApi
            key={propKey}
            propKey={propKey}
            propValue={configuration[propKey as keyof ApiAppConfiguration]}
            lSize={6}
            handler={patchHandler}
            schema={
              schema[propKey] as { type?: string; items?: { type?: string; enum?: string[] } }
            }
            doc_category="config_api_properties"
            disabled={isDisabled}
          />
        )
      })}

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
