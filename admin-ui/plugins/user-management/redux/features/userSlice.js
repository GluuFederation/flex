import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const initialState = {
  items: [],
  selectedUserData: null,
  loading: false,
  redirectToUserListPage: false,
  totalItems: 0,
  entriesCount: 0
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUsers: (state, action) => {
      state.loading = true
      state.redirectToUserListPage = false
    },
    getUser2FADetails: (state, action) => {
      state.loading = true
    },
    setUser2FADetails: (state, action) => {
      state.loading = false
    },
    setSelectedUserData: (state, action) => {
      state.selectedUserData = action.payload
    },
    getUserResponse: (state, action) => {
      state.loading = false
      state.items = action.payload ? action.payload.entries : []
      state.totalItems = action.payload ? action.payload.totalEntriesCount : 0
      state.entriesCount = action.payload ? action.payload.entriesCount : 0
    },
    createUser: (state, action) => {
      state.loading = true
    },
    createUserResponse: (state, action) => {
      state.loading = false
      state.redirectToUserListPage = action.payload ? true : false
    },
    updateUser: (state, action) => {
      state.loading = true
    },
    updateUserResponse: (state, action) => {
      state.loading = false
      state.redirectToUserListPage = action.payload ? true : false
    },
    changeUserPassword: (state, action) => {
      state.loading = true
    },
    changeUserPasswordResponse: (state, action) => {
      state.loading = false
    },
    deleteUser: (state, action) => {
      state.loading = true
    },
    deleteUserResponse: (state, action) => {
      state.loading = false
    }
  }
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
  deleteUserResponse
} = userSlice.actions
export { initialState }
export default userSlice.reducer
reducerRegistry.register('userReducer', userSlice.reducer)