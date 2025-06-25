import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ldap: [],
  item: {},
  loading: false,
  testStatus: null,
  savedForm: false,
}

const ldapSlice = createSlice({
  name: 'ldap',
  initialState,
  reducers: {
    getLdapConfig: (state) => {
      state.loading = true
    },
    getLdapResponse: (state, action) => {
      state.ldap = action.payload?.data || {}
      state.loading = false
    },
    addLdap: (state) => {
      state.loading = true
    },
    addLdapResponse: (state, action) => {
      if (action.payload?.data) {
        state.ldap = [...state.ldap, action.payload.data]
      }
      state.loading = false
    },
    editLdap: (state) => {
      state.loading = true
    },
    editLdapResponse: (state, action) => {
      state.ldap = action.payload?.data || {}
      state.loading = false
    },
    deleteLdap: (state) => {
      state.loading = true
    },
    deleteLdapResponse: (state, action) => {
      if (action.payload?.configId) {
        state.ldap = state.ldap.filter((i) => i.configId !== action.payload.configId)
      }
      state.loading = false
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload?.item
      state.loading = false
    },
    testLdap: (state) => {
      state.loading = true
    },
    testLdapResponse: (state, action) => {
      state.testStatus = !!action.payload?.data
      state.loading = false
    },
    resetTestLdap: (state) => {
      state.testStatus = initialState.testStatus
    },
    toggleSavedFormFlag: (state, action) => {
      state.savedForm = action.payload || false
    },
  },
})

export const {
  getLdapConfig,
  getLdapResponse,
  addLdap,
  addLdapResponse,
  editLdap,
  editLdapResponse,
  deleteLdap,
  deleteLdapResponse,
  setCurrentItem,
  testLdap,
  testLdapResponse,
  resetTestLdap,
  toggleSavedFormFlag,
} = ldapSlice.actions
export { initialState }
export const { actions, reducer } = ldapSlice
