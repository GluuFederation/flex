import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

export interface ProfileDetailsRequestPayload extends Record<string, unknown> {
  pattern: string
  userId?: string | null
}

interface ProfileDetailsState {
  profileDetails: Record<string, unknown> | null
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
    setUserProfileDetails: (state, action: PayloadAction<Record<string, unknown> | null>) => {
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
