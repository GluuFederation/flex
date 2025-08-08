import { JansAttribute, GetAttributesOptions } from '../../types'

// Define action payload types
export interface GetAttributesAction {
  type: string
  payload: {
    options: GetAttributesOptions
  }
}

export interface SearchAttributesAction {
  type: string
  payload: {
    options: GetAttributesOptions
  }
}

export interface AddAttributeAction {
  type: string
  payload: {
    action: {
      action_data: JansAttribute
    }
  }
}

export interface EditAttributeAction {
  type: string
  payload: {
    action: {
      action_data: JansAttribute
    }
  }
}

export interface DeleteAttributeAction {
  type: string
  payload: {
    inum: string
    name?: string
  }
}
