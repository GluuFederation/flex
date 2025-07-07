import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the permission item interface
interface PermissionItem {
  inum: string
  [key: string]: any // Allow for additional properties
}

// Define the state interface
interface ApiPermissionState {
  items: PermissionItem[]
  loading: boolean
  item?: PermissionItem
}

const initialState: ApiPermissionState = {
  items: [],
  loading: true,
}

const apiPermissionSlice = createSlice({
  name: 'apiPermission',
  initialState,
  reducers: {
    getPermissions: (state) => {
      state.loading = true
    },
    getPermissionsResponse: (state, action: PayloadAction<{ data?: PermissionItem[] }>) => {
      if (action.payload?.data) {
        return handleItems(state, action.payload.data)
      } else {
        return handleDefault(state)
      }
    },
    addPermission: (state) => {
      state.loading = true
    },
    addPermissionResponse: (state, action: PayloadAction<{ data?: PermissionItem }>) => {
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
    editPermission: (state) => {
      state.loading = true
    },
    editPermissionResponse: (state, action: PayloadAction<{ data?: PermissionItem[] }>) => {
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
    getPermission: (state) => {
      state.loading = true
    },
    getPermissionResponse: (state, action: PayloadAction<{ data?: PermissionItem[] }>) => {
      if (action.payload?.data) {
        return handleItems(state, action.payload.data)
      } else {
        return handleDefault(state)
      }
    },
    deletePermission: (state) => {
      state.loading = true
    },
    deletePermissionResponse: (state, action: PayloadAction<{ inum?: string }>) => {
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
    setCurrentItem: (state, action: PayloadAction<{ item?: PermissionItem }>) => ({
      ...state,
      item: action.payload?.item,
      loading: false,
    }),
  },
})

function handleItems(state: ApiPermissionState, data: PermissionItem[]): ApiPermissionState {
  return {
    ...state,
    items: data,
    loading: false,
  }
}

function handleDefault(state: ApiPermissionState): ApiPermissionState {
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

export const { actions, reducer } = apiPermissionSlice
export type { ApiPermissionState, PermissionItem }
reducerRegistry.register('apiPermissionReducer', reducer)
