import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ldapList: [],
  loading: false,
  saveStatus: 'idle',
  item: null,
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
      state.item = action.payload?.item ?? action.payload ?? null
    },
    addLdap: (state) => {
      state.loading = true
      state.saveStatus = 'pending'
    },
    addLdapSuccess: (state) => {
      state.loading = false
      state.saveStatus = 'succeeded'
    },
    addLdapFailure: (state) => {
      state.loading = false
      state.saveStatus = 'failed'
    },
    editLdap: (state) => {
      state.loading = true
      state.saveStatus = 'pending'
    },
    editLdapSuccess: (state) => {
      state.loading = false
      state.saveStatus = 'succeeded'
    },
    editLdapFailure: (state) => {
      state.loading = false
      state.saveStatus = 'failed'
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
  addLdap,
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
