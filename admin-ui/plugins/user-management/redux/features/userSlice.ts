import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import {
  CustomUser,
  UserPagedResult,
  FidoRegistrationEntry,
  User2FAPayload,
  GetUserOptions,
  UserModifyOptions,
  UserPatchOptions,
  UserState,
  SetUser2FADetailsPayload,
  ChangeUserPasswordPayload,
  DeleteUserPayload,
  AuditLogoutLogsPayload,
} from '../../types/UserApiTypes'

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
      state.loading = true
      state.redirectToUserListPage = false
    },
    getUser2FADetails: (state, action: PayloadAction<User2FAPayload>) => {
      state.loading = true
    },
    setUser2FADetails: (state, action: PayloadAction<SetUser2FADetailsPayload>) => {
      state.loading = false
      state.fidoDetails = action?.payload?.data ?? []
    },
    setSelectedUserData: (state, action: PayloadAction<CustomUser>) => {
      state.selectedUserData = action.payload
    },
    getUserResponse: (state, action: PayloadAction<UserPagedResult>) => {
      state.loading = false
      state.items = action.payload ? action.payload.entries || [] : []
      state.totalItems = action.payload ? action.payload.totalEntriesCount || 0 : 0
      state.entriesCount = action.payload ? action.payload.entriesCount || 0 : 0
    },
    createUser: (state, action: PayloadAction<UserModifyOptions>) => {
      state.loading = true
    },
    createUserResponse: (state, action: PayloadAction<boolean>) => {
      state.loading = false
      state.redirectToUserListPage = action?.payload || false
    },
    updateUser: (state, action: PayloadAction<UserModifyOptions>) => {
      state.loading = true
    },
    updateUserResponse: (state, action: PayloadAction<boolean>) => {
      state.loading = false
      state.redirectToUserListPage = action?.payload || false
    },
    changeUserPassword: (state, action: PayloadAction<ChangeUserPasswordPayload>) => {
      state.loading = true
    },
    changeUserPasswordResponse: (state, action: PayloadAction<void>) => {
      state.loading = false
    },
    deleteUser: (state, action: PayloadAction<DeleteUserPayload>) => {
      state.loading = true
    },
    deleteUserResponse: (state, action: PayloadAction<void>) => {
      state.loading = false
    },
    auditLogoutLogs: (state, action: PayloadAction<AuditLogoutLogsPayload>) => {
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
  DeleteUserPayload,
  AuditLogoutLogsPayload,
}

export { initialState }
export default userSlice.reducer
reducerRegistry.register('userReducer', userSlice.reducer)
