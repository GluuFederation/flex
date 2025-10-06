import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import {
  CustomUser,
  UserPagedResult,
  User2FAPayload,
  GetUserOptions,
  UserModifyOptions,
  UserState,
  SetUser2FADetailsPayload,
  ChangeUserPasswordPayload,
  AuditLogoutLogsPayload,
} from '../../types/UserApiTypes'
import { UserTableRowData } from 'Plugins/user-management/types'

const initialState: UserState = {
  items: [],
  selectedUserData: null,
  loading: false,
  redirectToUserListPage: false,
  totalItems: 0,
  entriesCount: 0,
  fidoDetails: {},
  isUserLogout: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUsers: (state, action: PayloadAction<GetUserOptions>) => {
      console.trace('getUsers', action.payload.limit, action.payload.pattern)
      state.loading = true
      state.redirectToUserListPage = false
    },
    getUser2FADetails: (state, action: PayloadAction<User2FAPayload>) => {
      console.trace('getUser2FADetails', action.payload.username.substring(0, 1))
      state.loading = true
    },
    setUser2FADetails: (state, action: PayloadAction<SetUser2FADetailsPayload>) => {
      state.loading = false
      state.fidoDetails = action?.payload?.data ?? []
    },
    setSelectedUserData: (state, action: PayloadAction<CustomUser | null>) => {
      state.selectedUserData = action.payload
    },
    getUserResponse: (state, action: PayloadAction<UserPagedResult>) => {
      state.loading = false
      state.items = action.payload ? action.payload.entries || [] : []
      state.totalItems = action.payload ? action.payload.totalEntriesCount || 0 : 0
      state.entriesCount = action.payload ? action.payload.entriesCount || 0 : 0
    },
    createUser: (state, action: PayloadAction<UserModifyOptions>) => {
      console.trace('createUser', action.payload.customUser?.inum)
      state.loading = true
    },
    createUserResponse: (state, action: PayloadAction<boolean>) => {
      state.loading = false
      state.redirectToUserListPage = action?.payload || false
    },
    updateUser: (state, action: PayloadAction<UserModifyOptions>) => {
      console.trace('updateUser', action.payload.customUser?.inum)
      state.loading = true
    },
    updateUserResponse: (state, action: PayloadAction<boolean>) => {
      state.loading = false
      state.redirectToUserListPage = action?.payload || false
    },
    changeUserPassword: (state, action: PayloadAction<ChangeUserPasswordPayload>) => {
      console.trace('changeUserPassword', action.payload.inum)
      state.loading = true
    },
    changeUserPasswordResponse: (state, action: PayloadAction<CustomUser | null>) => {
      console.trace('changeUserPasswordResponse', action.payload?.inum)
      state.loading = false
    },
    deleteUser: (state, action: PayloadAction<UserTableRowData>) => {
      console.trace('deleteUser', action.payload.inum)
      state.loading = true
    },
    deleteUserResponse: (state, action: PayloadAction<void>) => {
      console.trace('deleteUserResponse', action.payload)
      state.loading = false
    },
    auditLogoutLogs: (state, action: PayloadAction<AuditLogoutLogsPayload>) => {
      console.trace('auditLogoutLogs', action.payload)
      state.loading = true
    },
    auditLogoutLogsResponse: (state, action: PayloadAction<boolean>) => {
      state.isUserLogout = action.payload
    },
  },
})

export const {
  getUsers,
  getUser2FADetails,
  setUser2FADetails,
  setSelectedUserData,
  getUserResponse,
  createUser,
  createUserResponse,
  updateUser,
  updateUserResponse,
  changeUserPassword,
  changeUserPasswordResponse,
  deleteUser,
  deleteUserResponse,
  auditLogoutLogs,
  auditLogoutLogsResponse,
} = userSlice.actions

// Export types for use in other files
export type {
  UserState,
  SetUser2FADetailsPayload,
  ChangeUserPasswordPayload,
  UserTableRowData,
  AuditLogoutLogsPayload,
}

export { initialState }
export default userSlice.reducer
reducerRegistry.register('userReducer', userSlice.reducer)
