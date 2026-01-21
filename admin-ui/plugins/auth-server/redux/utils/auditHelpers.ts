import type { AgamaJsonPatch } from '../../components/Agama/types/agamaTypes'
import type { UserAction } from 'Utils/PermChecker'

const ACR_MAPPINGS_PATH = '/acrMappings'

const OPERATION_TYPES = {
  ADD: 'add',
  REPLACE: 'replace',
  REMOVE: 'remove',
} as const

const OPERATION_LABELS = {
  [OPERATION_TYPES.ADD]: 'create',
  [OPERATION_TYPES.REPLACE]: 'update',
  [OPERATION_TYPES.REMOVE]: 'delete',
} as const

interface AcrMapping {
  mapping: string
  source: string
}

interface AuditDetails {
  performedOn: string
  auditMessage: string
  modifiedFields: Record<string, string>
}

interface JsonConfigPayload {
  action: UserAction
}

interface EnhancedJsonConfigPayload {
  action: UserAction
}

interface DeletedMappingInfo {
  mapping: string
  source: string
}

interface ActionDataWithDelete {
  requestBody?: AgamaJsonPatch[]
  deletedMapping?: DeletedMappingInfo
}

const extractLatestMapping = (
  mappings: Record<string, string> | null | undefined,
): AcrMapping | null => {
  if (!mappings || typeof mappings !== 'object') {
    return null
  }

  const entries = Object.entries(mappings)
  if (entries.length === 0) {
    return null
  }

  const [mapping, source] = entries[entries.length - 1]
  return { mapping, source }
}

const createDeleteAuditDetails = (): Omit<AuditDetails, 'performedOn'> => ({
  auditMessage: 'Deleted ACR mapping',
  modifiedFields: {
    operation: OPERATION_LABELS[OPERATION_TYPES.REMOVE],
    path: ACR_MAPPINGS_PATH,
  },
})

const createAddAuditDetails = (
  mappings: Record<string, string>,
): Omit<AuditDetails, 'performedOn'> | null => {
  const latestMapping = extractLatestMapping(mappings)
  if (!latestMapping) {
    return null
  }

  return {
    auditMessage: `Created ACR mapping: ${latestMapping.mapping}`,
    modifiedFields: {
      ...latestMapping,
      operation: OPERATION_LABELS[OPERATION_TYPES.ADD],
    },
  }
}

const createReplaceAuditDetails = (
  mappings: Record<string, string>,
): Omit<AuditDetails, 'performedOn'> | null => {
  const latestMapping = extractLatestMapping(mappings)
  if (!latestMapping) {
    return null
  }

  return {
    auditMessage: `Updated ACR mapping: ${latestMapping.mapping}`,
    modifiedFields: {
      ...latestMapping,
      operation: OPERATION_LABELS[OPERATION_TYPES.REPLACE],
    },
  }
}

const processAcrMappingPatch = (patch: AgamaJsonPatch): AuditDetails | null => {
  if (!patch || patch.path !== ACR_MAPPINGS_PATH) {
    return null
  }

  const { op, value } = patch

  switch (op) {
    case OPERATION_TYPES.REMOVE:
      return {
        performedOn: ACR_MAPPINGS_PATH,
        ...createDeleteAuditDetails(),
      }

    case OPERATION_TYPES.ADD: {
      if (!value || typeof value !== 'object') {
        return null
      }
      const addDetails = createAddAuditDetails(value)
      if (!addDetails) {
        return null
      }
      return {
        performedOn: ACR_MAPPINGS_PATH,
        ...addDetails,
      }
    }

    case OPERATION_TYPES.REPLACE: {
      if (!value || typeof value !== 'object') {
        return null
      }
      const replaceDetails = createReplaceAuditDetails(value)
      if (!replaceDetails) {
        return null
      }
      return {
        performedOn: ACR_MAPPINGS_PATH,
        ...replaceDetails,
      }
    }

    default:
      return null
  }
}

export const enhanceJsonConfigAuditPayload = (
  payload: JsonConfigPayload,
  defaultResource: string,
): EnhancedJsonConfigPayload => {
  const actionData = payload?.action?.action_data as ActionDataWithDelete | undefined
  const requestBody = actionData?.requestBody
  const deletedMapping = actionData?.deletedMapping

  const userMessage = payload?.action?.action_message
  let modifiedFields: Record<string, string> = {}
  let performedOn = defaultResource
  let auditMessage = ''

  if (deletedMapping) {
    performedOn = ACR_MAPPINGS_PATH
    const deleteDetails = createDeleteAuditDetails()
    auditMessage = deleteDetails.auditMessage
    modifiedFields = {
      mapping: deletedMapping.mapping,
      source: deletedMapping.source,
      operation: OPERATION_LABELS[OPERATION_TYPES.REMOVE],
    }
  } else if (requestBody && Array.isArray(requestBody)) {
    for (const patch of requestBody) {
      const acrMappingDetails = processAcrMappingPatch(patch)
      if (acrMappingDetails) {
        performedOn = acrMappingDetails.performedOn
        auditMessage = acrMappingDetails.auditMessage
        modifiedFields = acrMappingDetails.modifiedFields
        break
      }
    }
  }

  // Important: do NOT append anything to the user's message.
  // Use derived auditMessage only when userMessage is absent.
  const finalMessage = userMessage || auditMessage || 'Updated JSON configuration'

  return {
    ...payload,
    action: {
      ...payload.action,
      action_message: finalMessage,
      action_data: {
        ...(actionData || {}),
        modifiedFields,
        performedOn,
      } as unknown as UserAction['action_data'],
    },
  } as EnhancedJsonConfigPayload
}
