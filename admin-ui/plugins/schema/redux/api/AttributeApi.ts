import { handleResponse } from 'Utils/ApiUtils'
import {
  JansAttribute,
  AttributePagedResult,
  GetAttributesPayload,
  AttributePatchRequest,
  IConfigurationAttributeApi,
  AttributeModifyOptions,
  AttributePatchOptions,
  GetAttributesOptions,
} from '../../types/AttributeApiTypes'

/**
 * TypeScript wrapper class for Jans Configuration API - Attribute operations
 *
 * This class provides a Promise-based interface for all attribute-related operations
 * including CRUD operations, search, and patch updates. It wraps the swagger-generated
 * AttributeApi from jans_config_api to provide better TypeScript support and error handling.
 *
 * @example
 * ```typescript
 * const api = new JansConfigApi.AttributeApi(getClient(JansConfigApi, token, issuer))
 * const attributeApi = new AttributeApi(api)
 *
 * // Get all attributes
 * const attributes = await attributeApi.getAttributes({ action: { limit: 50 } })
 *
 * // Create new attribute
 * const newAttribute = await attributeApi.createAttribute(attributeData)
 * ```
 */
export default class AttributeApi {
  private readonly api: IConfigurationAttributeApi

  constructor(api: IConfigurationAttributeApi) {
    this.api = api
  }

  /**
   * Get all attributes with optional filtering
   * @param payload - Object containing search options
   * @returns Promise<AttributePagedResult>
   */
  getAttributes = (payload: GetAttributesPayload): Promise<AttributePagedResult> => {
    return new Promise<AttributePagedResult>((resolve, reject) => {
      this.api.getAttributes(payload.action, (error: Error | null, data?: AttributePagedResult) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Get all attributes (legacy method for backward compatibility)
   * @param opts - Search options
   * @returns Promise<AttributePagedResult>
   */
  getAllAttributes = (opts: GetAttributesOptions): Promise<AttributePagedResult> => {
    return new Promise<AttributePagedResult>((resolve, reject) => {
      this.api.getAttributes(opts, (error: Error | null, data?: AttributePagedResult) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Search attributes (legacy method for backward compatibility)
   * @param opts - Search options
   * @returns Promise<AttributePagedResult>
   */
  searchAttributes = (opts: GetAttributesOptions): Promise<AttributePagedResult> => {
    return new Promise<AttributePagedResult>((resolve, reject) => {
      this.api.getAttributes(opts, (error: Error | null, data?: AttributePagedResult) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Get a specific attribute by inum
   * @param inum - Attribute identifier
   * @returns Promise<JansAttribute>
   */
  getAttributeByInum = (inum: string): Promise<JansAttribute> => {
    return new Promise<JansAttribute>((resolve, reject) => {
      this.api.getAttributesByInum(inum, (error: Error | null, data?: JansAttribute) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Create a new attribute
   * @param data - Attribute data
   * @returns Promise<JansAttribute>
   */
  createAttribute = (data: JansAttribute): Promise<JansAttribute> => {
    const options: AttributeModifyOptions = {
      jansAttribute: data,
    }
    return new Promise<JansAttribute>((resolve, reject) => {
      this.api.postAttributes(options, (error: Error | null, data?: JansAttribute) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Add a new attribute (legacy method for backward compatibility)
   * @param data - Attribute data
   * @returns Promise<JansAttribute>
   */
  addNewAttribute = (data: JansAttribute): Promise<JansAttribute> => {
    const options: AttributeModifyOptions = {
      jansAttribute: data,
    }
    return new Promise<JansAttribute>((resolve, reject) => {
      this.api.postAttributes(options, (error: Error | null, data?: JansAttribute) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Update an existing attribute
   * @param data - Attribute data
   * @returns Promise<JansAttribute>
   */
  updateAttribute = (data: JansAttribute): Promise<JansAttribute> => {
    const options: AttributeModifyOptions = {
      jansAttribute: data,
    }
    return new Promise<JansAttribute>((resolve, reject) => {
      this.api.putAttributes(options, (error: Error | null, data?: JansAttribute) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Edit an attribute (legacy method for backward compatibility)
   * @param data - Attribute data
   * @returns Promise<JansAttribute>
   */
  editAnAttribute = (data: JansAttribute): Promise<JansAttribute> => {
    const options: AttributeModifyOptions = {
      jansAttribute: data,
    }
    return new Promise<JansAttribute>((resolve, reject) => {
      this.api.putAttributes(options, (error: Error | null, data?: JansAttribute) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Partially update an attribute using JSON Patch
   * @param inum - Attribute identifier
   * @param patchData - Array of patch operations
   * @returns Promise<JansAttribute>
   */
  patchAttribute = (inum: string, patchData: AttributePatchRequest[]): Promise<JansAttribute> => {
    const options: AttributePatchOptions = {
      patchRequest: patchData,
    }
    return new Promise<JansAttribute>((resolve, reject) => {
      this.api.patchAttributesByInum(inum, options, (error: Error | null, data?: JansAttribute) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Delete an attribute by inum
   * @param inum - Attribute identifier
   * @returns Promise<void>
   */
  deleteAttribute = (inum: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.api.deleteAttributesByInum(inum, (error: Error | null, data?: unknown) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Delete an attribute (legacy method for backward compatibility)
   * @param inum - Attribute identifier
   * @returns Promise<void>
   */
  deleteAnAttribute = (inum: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.api.deleteAttributesByInum(inum, (error: Error | null, data?: unknown) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }
}
