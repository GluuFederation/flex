import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import unionBy from 'lodash/unionBy'

const initialState = {
  items: [],
  loading: false,
  initLoading: true,
  accessToken: null
}

const attributesSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
    getAttributesRoot: (state, action) => {
      state.loading = true
    },
    getAttributesResponseRoot: (state, action) => {
      state.loading = false
      const { data } = action.payload
      if (data) {
        state.items = unionBy(data.entries, state.items, 'displayName')
      }
    },
    toggleInitAttributeLoader: (state, action) => {
      state.initLoading = action.payload
    }
  }
})

export const { getAttributesRoot, getAttributesResponseRoot, toggleInitAttributeLoader, setAccessToken } =
  attributesSlice.actions

export default attributesSlice.reducer
reducerRegistry.register('attributesReducerRoot', attributesSlice.reducer)
