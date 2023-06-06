import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  item: {},
  loading: false,
  totalItems: 0,
  entriesCount: 0
}

const attributeSlice = createSlice({
  name: 'attribute',
  initialState,
  reducers: {
    getAttributes: (state) => {
      state.loading = true
    },
    searchAttributes: (state) => {
      state.loading = true
    },
    getAttributesResponse: (state, action) => {
      if (action.payload.data) {
        state.items = action.payload.data.entries
        state.totalItems = action.payload.data.totalEntriesCount
        state.entriesCount = action.payload.data.entriesCount
        state.loading = false
      } else {
        state.loading = false
      }
    },
    addAttribute: (state) => {
      state.loading = true
    },
    addAttributeResponse: (state, action) => {
      if (action.payload?.data) {
        state.items.push(action.payload.data)
        state.loading = false
      } else {
        state.loading = false
      }
    },
    editAttribute: (state) => {
      state.loading = true
    },
    editAttributeResponse: (state, action) => {
      state.loading = false
    },
    deleteAttribute: (state) => {
      state.loading = true
    },
    deleteAttributeResponse: (state, action) => {
      if (action.payload?.inum) {
        state.items = state.items.filter((i) => i.inum !== action.payload.inum)
        state.loading = false
      } else {
        state.loading = false
      }
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload?.item
      state.loading = false
    }
  }
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
  setCurrentItem
} = attributeSlice.actions
export const { actions, reducer, state } = attributeSlice
reducerRegistry.register('attributeReducer', reducer)
