import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ldapList: [],
  loading: false,
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
    },
  },
})

export const { getLdapList, getLdapListSuccess, getLdapListFailure, setCurrentItem } =
  authNLdapSlice.actions
export default authNLdapSlice.reducer
