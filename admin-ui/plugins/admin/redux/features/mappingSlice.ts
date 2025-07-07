import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define types for the mapping items
interface Permission {
  id: number
  name: string
  [key: string]: any
}

interface MappingItem {
  role: string
  permissions: Permission[]
  [key: string]: any
}

// Define the state interface
interface MappingState {
  items: MappingItem[]
  serverItems: MappingItem[]
  loading: boolean
}

// Define payload types for actions
interface GetMappingResponsePayload {
  data?: MappingItem[]
}

interface AddPermissionsToRolePayload {
  data: {
    data: Permission[]
    userRole: string
  }
}

interface UpdatePermissionsLoadingPayload {
  data: boolean
}

interface UpdatePermissionsServerResponsePayload {
  data?: MappingItem
}

interface UpdateMappingPayload {
  data?: {
    id: number
    role: string
  }
}

const initialState: MappingState = {
  items: [],
  serverItems: [],
  loading: false,
}

const mappingSlice = createSlice({
  name: 'mapping',
  initialState,
  reducers: {
    getMapping: (state) => handleLoading(state),
    getMappingResponse: (state, action: PayloadAction<GetMappingResponsePayload>) => {
      if (action.payload.data) {
        return handleItems(state, action.payload.data)
      } else {
        return handleDefault(state)
      }
    },
    addPermissionsToRole: (state, action: PayloadAction<AddPermissionsToRolePayload>) => {
      const { data, userRole } = action.payload.data
      let roleIndex = state.items.findIndex((element) => element.role === userRole)
      if (roleIndex !== -1) {
        let existingPermissions = state.items[roleIndex].permissions
        let newArr = existingPermissions.concat(data)
        let addedPermissions = [...state.items]
        addedPermissions[roleIndex].permissions = newArr
        state.items = addedPermissions
      }
    },
    updatePermissionsLoading: (state, action: PayloadAction<UpdatePermissionsLoadingPayload>) => ({
      ...state,
      loading: action.payload.data,
    }),
    updatePermissionsServerResponse: (state, action: PayloadAction<UpdatePermissionsServerResponsePayload>) => {
      if (action.payload?.data) {
        let indexToUpdatePermissions = state.items.findIndex(
          (element) => element.role === action.payload.data?.role,
        )
        if (indexToUpdatePermissions !== -1) {
          let changedData = [...state.items]
          changedData[indexToUpdatePermissions] = action.payload.data
          state.items = changedData
          state.loading = false
        }
      }
    },
    updateMapping: (state, action: PayloadAction<UpdateMappingPayload>) => {
      if (action.payload?.data) {
        const { id, role } = action.payload.data
        let index = state.items.findIndex((element) => element.role === role)
        if (index !== -1) {
          let permissions = [...state.items[index].permissions]
          permissions.splice(id, 1)
          let changedPermissions = [...state.items]
          changedPermissions[index].permissions = permissions
          state.items = changedPermissions
        }
      }
    },
    updatePermissionsToServer: (state, action: PayloadAction<any>) => {},
    addNewRolePermissions: (state, action: PayloadAction<any>) => {},
    deleteMapping: (state, action: PayloadAction<any>) => {},
  },
})

function handleItems(state: MappingState, data: MappingItem[]): MappingState {
  return {
    ...state,
    items: data,
    loading: false,
  }
}

function handleLoading(state: MappingState): MappingState {
  return {
    ...state,
    loading: true,
  }
}

function handleDefault(state: MappingState): MappingState {
  return {
    ...state,
    loading: false,
  }
}

export const {
  getMapping,
  getMappingResponse,
  addPermissionsToRole,
  updatePermissionsLoading,
  updatePermissionsServerResponse,
  updateMapping,
  updatePermissionsToServer,
  addNewRolePermissions,
  deleteMapping,
} = mappingSlice.actions

export { initialState }
export const { actions, reducer } = mappingSlice
export type { MappingState, MappingItem, Permission }
reducerRegistry.register('mappingReducer', reducer)
