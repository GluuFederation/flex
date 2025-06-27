import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ApiRole {
  inum: string
  [key: string]: any
}

interface ApiRoleState {
  items: ApiRole[]
  loading: boolean
  item?: ApiRole
}

interface ApiRoleResponse {
  data: ApiRole
}

interface DeleteRoleResponse {
  inum: string
}

interface SetCurrentItemPayload {
  item: ApiRole
}

const initialState: ApiRoleState = {
  items: [],
  loading: false,
}

const apiRoleSlice = createSlice({
  name: 'apiRole',
  initialState,
  reducers: {
    getRoles: (state, action: PayloadAction<any>) => {
      state.loading = true
    },
    getRolesResponse: (state, action: PayloadAction<{ data: ApiRole[] }>) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = action.payload.data
      }
    },
    addRole: (state, action: PayloadAction<any>) => {
      state.loading = true
    },
    addRoleResponse: (state, action: PayloadAction<ApiRoleResponse>) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = [...state.items, action.payload.data]
      }
    },
    editRole: (state, action: PayloadAction<any>) => {
      state.loading = true
    },
    editRoleResponse: (state, action: PayloadAction<ApiRoleResponse>) => {
      state.loading = false
      if (action.payload?.data) {
        let currentItems = [...state.items]
        currentItems.push(action.payload.data)
        state.items = currentItems
      }
    },
    getRole: (state, action: PayloadAction<any>) => {
      state.loading = true
    },
    getRoleResponse: (state, action: PayloadAction<{ data: ApiRole }>) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = [action.payload.data]
      }
    },
    deleteRole: (state, action: PayloadAction<any>) => {
      state.loading = true
    },
    deleteRoleResponse: (state, action: PayloadAction<DeleteRoleResponse>) => {
      state.loading = false
      if (action.payload?.inum) {
        state.items = state.items.filter((item) => item.inum !== action.payload.inum)
      }
    },
    setCurrentItem: (state, action: PayloadAction<SetCurrentItemPayload>) => {
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
export const { actions, reducer } = apiRoleSlice
reducerRegistry.register('apiRoleReducer', reducer)
