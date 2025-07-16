import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define interfaces for TypeScript
interface AttributeValidation {
  regexp?: string | null
  minLength?: number | null
  maxLength?: number | null
}

interface AttributeItem {
  inum?: string
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  viewType: string[]
  usageType: string[]
  jansHideOnDiscovery: boolean
  oxMultiValuedAttribute: boolean
  attributeValidation: AttributeValidation
  scimCustomAttr: boolean
  claimName?: string
  saml1Uri?: string
  saml2Uri?: string
}

interface AttributeState {
  items: AttributeItem[]
  item: AttributeItem | {}
  loading: boolean
  totalItems: number
  entriesCount: number
}

interface AttributeResponsePayload {
  data?: {
    entries?: AttributeItem[]
    totalEntriesCount: number
    entriesCount: number
  }
}

interface AttributeActionPayload {
  action: {
    action_data: AttributeItem
    action_message: string
  }
}

interface DeleteAttributePayload {
  inum: string
}

interface SetCurrentItemPayload {
  item: AttributeItem
}

const initialState: AttributeState = {
  items: [],
  item: {},
  loading: false,
  totalItems: 0,
  entriesCount: 0,
}

const attributeSlice = createSlice({
  name: 'attribute',
  initialState,
  reducers: {
    getAttributes: (state, action: PayloadAction<any>) => {
      state.loading = true
    },
    searchAttributes: (state, action: PayloadAction<any>) => {
      state.loading = true
    },
    getAttributesResponse: (state, action: PayloadAction<AttributeResponsePayload>) => {
      if (action.payload.data) {
        state.items = action.payload.data?.entries || []
        state.totalItems = action.payload.data.totalEntriesCount
        state.entriesCount = action.payload.data.entriesCount
        state.loading = false
      } else {
        state.loading = false
      }
    },
    addAttribute: (state, action: PayloadAction<AttributeActionPayload>) => {
      state.loading = true
    },
    addAttributeResponse: (state, action: PayloadAction<{ data?: AttributeItem }>) => {
      if (action.payload?.data) {
        state.items.push(action.payload.data)
        state.loading = false
      } else {
        state.loading = false
      }
    },
    editAttribute: (state, action: PayloadAction<AttributeActionPayload>) => {
      state.loading = true
    },
    editAttributeResponse: (state, action: PayloadAction<any>) => {
      state.loading = false
    },
    deleteAttribute: (state, action: PayloadAction<DeleteAttributePayload>) => {
      state.loading = true
    },
    deleteAttributeResponse: (state, action: PayloadAction<DeleteAttributePayload>) => {
      if (action.payload?.inum) {
        state.items = state.items.filter((i) => i.inum !== action.payload.inum)
        state.loading = false
      } else {
        state.loading = false
      }
    },
    setCurrentItem: (state, action: PayloadAction<SetCurrentItemPayload>) => {
      state.item = action.payload?.item
      state.loading = false
    },
  },
})

export const {
  getAttributes,
  searchAttributes,
  getAttributesResponse,
  addAttribute,
  addAttributeResponse,
  editAttribute,
  editAttributeResponse,
  deleteAttribute,
  deleteAttributeResponse,
  setCurrentItem,
} = attributeSlice.actions
export { initialState }
export const { actions, reducer } = attributeSlice
reducerRegistry.register('attributeReducer', reducer)
