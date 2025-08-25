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
  },
})

export const { getLdapList, getLdapListSuccess, getLdapListFailure } = authNLdapSlice.actions
export default authNLdapSlice.reducer
