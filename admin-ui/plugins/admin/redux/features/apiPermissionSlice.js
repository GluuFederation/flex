import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: true,
}

const apiPermissionSlice = createSlice({
  name: 'apiPermission',
  initialState,
  reducers: {
    getPermissions: (state, action) => {
      state.loading = true
    },
    getPermissionsResponse: (state, action) => {
      if (action.payload?.data) {
        return handleItems(state, action.payload.data)
      } else {
        return handleDefault(state)
      }
    },
    addPermission: (state, action) => {
      state.loading = true
    },
    addPermissionResponse: (state, action) => {
      if (action.payload?.data) {
        return {
          ...state,
          items: [...state.items, action.payload.data],
          loading: false,
        }
      } else {
        return handleDefault(state)
      }
    },
    editPermission: (state, action) => {
      state.loading = true
    },
    editPermissionResponse: (state, action) => {
      if (action.payload?.data) {
        return {
          ...state,
          items: [...action.payload.data],
          loading: false,
        }
      } else {
        return handleDefault(state)
      }
    },
    getPermission: (state, action) => {
      state.loading = true
    },
    getPermissionResponse: (state, action) => {
      if (action.payload?.data) {
        return handleItems(state, action.payload.data)
      } else {
        return handleDefault(state)
      }
    },
    deletePermission: (state, action) => {
      state.loading = true
    },
    deletePermissionResponse: (state, action) => {
      if (action.payload?.inum) {
        return {
          ...state,
          items: state.items.filter((item) => item.inum !== action.payload.inum),
          loading: false,
        }
      } else {
        return handleDefault(state)
      }
    },
    setCurrentItem: (state, action) => ({
      ...state,
      item: action.payload?.item,
      loading: false,
    }),
  },
})

function handleItems(state, data) {
  return {
    ...state,
    items: data,
    loading: false,
  }
}

function handleDefault(state) {
  return {
    ...state,
    loading: false,
  }
}

export const {
  getPermissions,
  getPermissionsResponse,
  addPermission,
  addPermissionResponse,
  editPermission,
  editPermissionResponse,
  getPermission,
  getPermissionResponse,
  deletePermission,
  deletePermissionResponse,
  setCurrentItem,
} = apiPermissionSlice.actions
export const { actions, reducer, state } = apiPermissionSlice
reducerRegistry.register('apiPermissionReducer', reducer)
