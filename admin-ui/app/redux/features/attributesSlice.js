import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import unionBy from 'lodash/unionBy'

const initialState = {
  items: [],
  loading: false
}

const attributesSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    getAttributesRoot: (state, action) => {
      state.loading = true
    },
    getAttributesResponseRoot: (state, action) => {
      state.loading = false
      const { data } = action.payload
      if (data) {
        state.items = unionBy(data.entries, state.items, 'displayName')
      }
    }
  }
})

export const { getAttributesRoot, getAttributesResponseRoot } =
  attributesSlice.actions

export default attributesSlice.reducer
reducerRegistry.register('attributesReducerRoot', attributesSlice.reducer)
