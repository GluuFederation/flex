import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
}

const apiRoleSlice = createSlice({
  name: 'apiRole',
  initialState,
  reducers: {
    getRoles: (state, action) => {
      state.loading = true
    },
    getRolesResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = action.payload.data
      }
    },
    addRole: (state, action) => {
      state.loading = true
    },
    addRoleResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = [...state.items, action.payload.data]
      }
    },
    editRole: (state, action) => {
      state.loading = true
    },
    editRoleResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        const currentItems = [...state.items]
        currentItems.push(action.payload.data)
        state.items = currentItems
      }
    },
    getRole: (state, action) => {
      state.loading = true
    },
    getRoleResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = action.payload.data
      }
    },
    deleteRole: (state, action) => {
      state.loading = true
    },
    deleteRoleResponse: (state, action) => {
      state.loading = false
      if (action.payload?.inum) {
        state.items = state.items.filter((item) => item.inum !== action.payload.inum)
      }
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload.item
      state.loading = false
    },
  },
})

export const {
  getRoles,
  getRolesResponse,
  getRole,
  getRoleResponse,
  addRole,
  addRoleResponse,
  deleteRole,
  deleteRoleResponse,
  editRole,
  editRoleResponse,
  setCurrentItem,
} = apiRoleSlice.actions
export const { actions, reducer, state } = apiRoleSlice
reducerRegistry.register('apiRoleReducer', reducer)
