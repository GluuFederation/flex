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
  errorSSA: '',
  generatingTrialKey: false,
  isNoValidLicenseKeyFound: false,
  isUnderThresholdLimit: true,
  isValidatingFlow: false,
}

const licenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {
    checkLicensePresent: (state, _action) => {
      state.islicenseCheckResultLoaded = false
    },
    checkUserApi: (state, _action) => {
      state.isLoading = true
      state.error = ''
    },
    checkUserLicenceKey: (state, _action) => {
      state.isLoading = true
      state.error = ''
    },
    checkUserLicenseKeyResponse: (state, action) => {
      if (action.payload?.success) {
        state.isLicenseValid = action.payload.success
        state.error = ''
      } else {
        state.error = action.payload.responseMessage
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
    checkLicenseConfigValid: (_state, _action) => {},
    checkLicenseConfigValidResponse: (state, action) => {
      state.isConfigValid = action.payload || false
    },
    uploadNewSsaToken: (state, _action) => {
      state.isLoading = true
      state.errorSSA = ''
    },
    uploadNewSsaTokenResponse: (state, action) => {
      state.isLoading = false
      state.errorSSA = action?.payload
    },
    generateTrialLicense: (state) => {
      state.generatingTrialKey = true
    },
    generateTrialLicenseResponse: (state, _action) => {
      state.generatingTrialKey = false
    },
    retrieveLicenseKey: (state, _action) => {
      state.isLoading = true
    },
    retrieveLicenseKeyResponse: (state, action) => {
      state.isLoading = false
      state.isNoValidLicenseKeyFound = action.payload.isNoValidLicenseKeyFound
    },
    checkThresholdLimit: (state, action) => {
      state.isUnderThresholdLimit = action.payload.isUnderThresholdLimit
      state.isLoading = false
    },
    setValidatingFlow: (state, action) => {
      state.isValidatingFlow = action.payload.isValidatingFlow
    },
    setLicenseError: (state, action) => {
      state.error = action.payload
    },
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
  uploadNewSsaTokenResponse,
  generateTrialLicense,
  generateTrialLicenseResponse,
  retrieveLicenseKey,
  retrieveLicenseKeyResponse,
  checkThresholdLimit,
  setValidatingFlow,
  setLicenseError,
} = licenseSlice.actions

export default licenseSlice.reducer
reducerRegistry.register('licenseReducer', licenseSlice.reducer)
