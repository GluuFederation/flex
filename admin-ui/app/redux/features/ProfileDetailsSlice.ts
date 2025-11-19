import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import type { ProfileDetails } from 'Routes/Apps/Profile/types'

export interface ProfileDetailsRequestPayload extends Record<string, unknown> {
  pattern: string
  userId?: string | null
}

interface ProfileDetailsState {
  profileDetails: ProfileDetails | null
  loading: boolean
}

const initialState: ProfileDetailsState = {
  profileDetails: null,
  loading: false,
}

const profileDetailsSlice = createSlice({
  name: 'profileDetails',
  initialState,
  reducers: {
    checkIsLoadingDetails: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setUserProfileDetails: (state, action: PayloadAction<ProfileDetails | null>) => {
      state.profileDetails = action.payload
    },
    getProfileDetails: (state, _action: PayloadAction<ProfileDetailsRequestPayload>) => {
      state.loading = true
    },
  },
})

export const { checkIsLoadingDetails, getProfileDetails, setUserProfileDetails } =
  profileDetailsSlice.actions

export default profileDetailsSlice.reducer
reducerRegistry.register('profileDetailsReducer', profileDetailsSlice.reducer)
