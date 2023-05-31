import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: true
}

const apiPermissionSlice = createSlice({
  name: 'apiPermission',
  initialState,
  reducers: {
    getPermissions: (state, action) => handleLoading(state),
    getPermissionsResponse: (state, action) => {
      if (action.payload?.data) {
        return handleItems(state, action.payload.data)
      } else {
        return handleDefault(state)
      }
    },
    addPermission: (state, action) => handleLoading(state),
    addPermissionResponse: (state, action) => {
      if (action.payload?.data) {
        return {
          ...state,
          items: [...state.items, action.payload.data],
          loading: false
        }
      } else {
        return handleDefault(state)
      }
    },
    editPermission: (state, action) => handleLoading(state),
    editPermissionResponse: (state, action) => {
      if (action.payload?.data) {
        return {
          ...state,
          items: [...action.payload.data],
          loading: false
        }
      } else {
        return handleDefault(state)
      }
    },
    getPermission: (state, action) => handleLoading(state),
    getPermissionResponse: (state, action) => {
      if (action.payload?.data) {
        return handleItems(state, action.payload.data)
      } else {
        return handleDefault(state)
      }
    },
    deletePermission: (state, action) => handleLoading(state),
    deletePermissionResponse: (state, action) => {
      if (action.payload?.inum) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.inum !== action.payload.inum
          ),
          loading: false
        }
      } else {
        return handleDefault(state)
      }
    },
    setCurrentItem: (state, action) => ({
      ...state,
      item: action.payload?.item,
      loading: false
    })
  }
})

function handleItems(state, data) {
  return {
    ...state,
    items: data,
    loading: false
  }
}

function handleDefault(state) {
  return {
    ...state,
    loading: false
  }
}

function handleLoading(state) {
  return {
    ...state,
    loading: true
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
  setCurrentItem
} = apiPermissionSlice.actions
export const { actions, reducer, state } = apiPermissionSlice
reducerRegistry.register('apiPermissionReducer', reducer)
