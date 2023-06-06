import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const initialState = {
  isLicenseValid: false,
  islicenseCheckResultLoaded: false,
  isLicenseActivationResultLoaded: false,
  isLicenceAPIkeyValid: false,
  isLoading: false,
  isConfigValid: null,
  error: '',
  errorSSA: ''
}

const licenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {
    checkLicensePresent: (state, action) => {
      state.islicenseCheckResultLoaded = false
    },
    checkUserApi: (state, action) => {
      state.isLoading = true
      state.error = ''
    },
    checkUserLicenceKey: (state, action) => {
      state.isLoading = true
      state.error = ''
    },
    checkUserLicenseKeyResponse: (state, action) => {
      if (action.payload?.apiResult) {
        state.isLicenseValid = action.payload.apiResult
        state.error = ''
        state.isLoading = false
      } else {
        state.error = action.payload.responseMessage
        state.isLoading = false
      }
    },
    checkLicensePresentResponse: (state, action) => {
      if (action.payload?.isLicenseValid) {
        state.isLicenseValid = action.payload.isLicenseValid
        state.islicenseCheckResultLoaded = true
      } else {
        state.islicenseCheckResultLoaded = true
      }
    },
    checkLicenseConfigValid: (state, action) => {},
    checkLicenseConfigValidResponse: (state, action) => {
      state.isLoading = false
      state.isConfigValid = action.payload || false
    },
    uploadNewSsaToken: (state, action) => {
      state.isLoading = true
      state.errorSSA = ''
    },
    uploadNewSsaTokenResponse: (state, action) => {
      state.isLoading = false
      state.errorSSA = action?.payload
    }
  },
})

export const {
  checkLicensePresent,
  checkUserApi,
  checkUserLicenceKey,
  checkUserLicenseKeyResponse,
  checkLicensePresentResponse,
  checkLicenseConfigValid,
  checkLicenseConfigValidResponse,
  uploadNewSsaToken,
  uploadNewSsaTokenResponse
} = licenseSlice.actions

export default licenseSlice.reducer
reducerRegistry.register('licenseReducer', licenseSlice.reducer)