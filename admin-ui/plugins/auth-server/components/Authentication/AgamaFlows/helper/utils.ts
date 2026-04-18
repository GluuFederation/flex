import type { AcrMapping, ApiError } from '../types'
import type { AgamaJsonPatchRequestBody } from '../types/agamaTypes'
import type { AcrMappingFormValues } from '../types/formTypes'
import type { ActionData } from 'Utils/PermChecker'
import { JSON_PATCH_PATHS, JSON_PATCH_OPS } from '../../constants'

export const getErrorMessage = (error: ApiError, fallback = 'An error occurred'): string =>
  error instanceof Error ? error.message || fallback : error?.message || fallback

export const transformAcrMappingsToTableData = (
  acrMappings?: Record<string, string>,
): AcrMapping[] => {
  if (!acrMappings) {
    return []
  }
  return Object.entries(acrMappings).map(([key, value]) => ({
    mapping: key,
    source: value,
  }))
}

export const buildAcrMappingPayload = (
  mappings: Record<string, string>,
  existingMappings?: Record<string, string>,
): AgamaJsonPatchRequestBody => {
  return {
    requestBody: [
      {
        path: JSON_PATCH_PATHS.ACR_MAPPINGS,
        value: mappings,
        op: existingMappings ? JSON_PATCH_OPS.REPLACE : JSON_PATCH_OPS.ADD,
      },
    ],
  }
}

export const buildAcrMappingDeletePayload = (
  mappings: Record<string, string>,
  existingMappings?: Record<string, string>,
): AgamaJsonPatchRequestBody => {
  if (Object.keys(mappings).length === 0 && existingMappings) {
    return {
      requestBody: [
        {
          path: JSON_PATCH_PATHS.ACR_MAPPINGS,
          op: JSON_PATCH_OPS.REMOVE,
        },
      ],
    }
  }
  return {
    requestBody: [
      {
        path: JSON_PATCH_PATHS.ACR_MAPPINGS,
        value: mappings,
        op: existingMappings ? JSON_PATCH_OPS.REPLACE : JSON_PATCH_OPS.ADD,
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
  return { requestBody: payload.requestBody }
}
