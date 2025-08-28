import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ldapList: [],
  loading: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
}

const authNLdapSlice = createSlice({
  name: 'authNLdap',
  initialState,
  reducers: {
    getLdapList: (state) => {
      state.loading = true
    },
    getLdapListSuccess: (state, action) => {
      state.ldapList = action.payload || []
      state.loading = false
    },
    getLdapListFailure: (state) => {
      state.ldapList = []
      state.loading = false
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload?.item || null
    },
    addLdap: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    addLdapSuccess: (state) => {
      state.loading = false
      state.saveOperationFlag = true
      state.errorInSaveOperationFlag = false
    },
    addLdapFailure: (state) => {
      state.loading = false
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = true
    },
    editLdap: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    editLdapSuccess: (state) => {
      state.loading = false
      state.saveOperationFlag = true
      state.errorInSaveOperationFlag = false
    },
    editLdapFailure: (state) => {
      state.loading = false
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = true
    },
    deleteLdap: (state) => {
      state.loading = true
    },
    deleteLdapSuccess: (state) => {
      state.loading = false
    },
    deleteLdapFailure: (state) => {
      state.loading = false
    },
  },
})

export const {
  getLdapList,
  getLdapListSuccess,
  getLdapListFailure,
  setCurrentItem,
  addLdapSuccess,
  addLdapFailure,
  editLdap,
  editLdapSuccess,
  editLdapFailure,
  deleteLdap,
  deleteLdapSuccess,
  deleteLdapFailure,
} = authNLdapSlice.actions
export default authNLdapSlice.reducer
