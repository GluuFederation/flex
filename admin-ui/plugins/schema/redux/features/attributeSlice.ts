import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JansAttribute, AttributePagedResult, GetAttributesOptions } from '../../types'
import { AttributeState } from 'Plugins/schema/components/types/AttributeListPage.types'

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
    getAttributes: (state, action: PayloadAction<{ options: GetAttributesOptions }>) => {
      state.loading = true
    },
    searchAttributes: (state, action: PayloadAction<{ options: GetAttributesOptions }>) => {
      state.loading = true
    },
    getAttributesResponse: (state, action: PayloadAction<{ data?: AttributePagedResult }>) => {
      if (action.payload.data) {
        state.items = action.payload.data?.entries || []
        state.totalItems = action.payload.data.totalEntriesCount || 0
        state.entriesCount = action.payload.data.entriesCount || 0
        state.loading = false
      } else {
        state.loading = false
      }
    },
    addAttribute: (
      state,
      action: PayloadAction<{ action: { action_data: JansAttribute; action_message?: string } }>,
    ) => {
      state.loading = true
    },
    addAttributeResponse: (state, action: PayloadAction<{ data?: JansAttribute }>) => {
      if (action.payload?.data) {
        state.items.push(action.payload.data)
        state.loading = false
      } else {
        state.loading = false
      }
    },
    editAttribute: (
      state,
      action: PayloadAction<{ action: { action_data: JansAttribute; action_message?: string } }>,
    ) => {
      state.loading = true
    },
    editAttributeResponse: (state, action: PayloadAction<{ data?: JansAttribute }>) => {
      state.loading = false
    },
    deleteAttribute: (state, action: PayloadAction<{ inum: string; name?: string }>) => {
      state.loading = true
    },
    deleteAttributeResponse: (state, action: PayloadAction<{ inum?: string }>) => {
      if (action.payload?.inum) {
        state.items = state.items.filter((i) => i.inum !== action.payload.inum)
        state.loading = false
      } else {
        state.loading = false
      }
    },
    setCurrentItem: (state, action: PayloadAction<{ item?: JansAttribute }>) => {
      state.item = action.payload?.item || {}
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
