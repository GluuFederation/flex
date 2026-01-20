import type { AcrMapping } from '../types'
import type { AgamaJsonPatchRequestBody } from '../types/agamaTypes'
import type { AcrMappingFormValues } from '../types/formTypes'
import type { ActionData } from 'Utils/PermChecker'

export const transformAcrMappingsToTableData = (
  acrMappings?: Record<string, string>,
): AcrMapping[] => {
  if (!acrMappings) {
    return []
  }
  return Object.entries(acrMappings).map(([key, value]) => ({
    mapping: key,
    source: value as string,
  }))
}

export const buildAcrMappingPayload = (
  mappings: Record<string, string>,
  existingMappings?: Record<string, string>,
): AgamaJsonPatchRequestBody => {
  return {
    requestBody: [
      {
        path: '/acrMappings',
        value: mappings,
        op: existingMappings ? 'replace' : 'add',
      },
    ],
  }
}

export const buildAcrMappingDeletePayload = (
  mappings: Record<string, string>,
  existingMappings?: Record<string, string>,
): AgamaJsonPatchRequestBody => {
  return {
    requestBody: [
      {
        path: '/acrMappings',
        value: mappings,
        op: existingMappings ? 'replace' : 'add',
      },
    ],
  }
}

export const prepareMappingsForUpdate = (
  currentMappings: Record<string, string>,
  values: AcrMappingFormValues,
  isEdit: boolean,
  oldMapping?: string,
): Record<string, string> => {
  const updatedMappings = { ...currentMappings }

  if (isEdit && oldMapping && oldMapping !== values.mapping) {
    delete updatedMappings[oldMapping]
  }

  updatedMappings[values.mapping] = values.source
  return updatedMappings
}

export const prepareMappingsForDelete = (
  currentMappings: Record<string, string>,
  mappingToDelete: string,
): Record<string, string> => {
  const updatedMappings = { ...currentMappings }
  delete updatedMappings[mappingToDelete]
  return updatedMappings
}

export const toActionData = (payload: AgamaJsonPatchRequestBody): ActionData => {
  return payload as ActionData
}
