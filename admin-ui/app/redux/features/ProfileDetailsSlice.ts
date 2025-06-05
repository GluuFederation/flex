import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const initialState = {
  profileDetails: null,
  loading: false,
}

const profileDetailsSlice = createSlice({
  name: 'profileDetails',
  initialState,
  reducers: {
    checkIsLoadingDetails: (state, action) => {
      state.loading = action.payload
    },
    setUserProfileDetails: (state, action) => {
      state.profileDetails = action.payload
    },
    getProfileDetails: (state, action) => {
      state.loading = true
    }
  },
})

export const { checkIsLoadingDetails, getProfileDetails, setUserProfileDetails } =
  profileDetailsSlice.actions

export default profileDetailsSlice.reducer
reducerRegistry.register('profileDetailsReducer', profileDetailsSlice.reducer)
