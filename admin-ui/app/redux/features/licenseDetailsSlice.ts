import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface LicenseDetailsItem {
  companyName?: string
  customerEmail?: string
  customerFirstName?: string
  customerLastName?: string
  licenseActive?: boolean
  licenseEnable?: boolean
  licenseEnabled?: boolean
  licenseKey?: string
  licenseType?: string
  maxActivations?: number
  productCode?: string
  productName?: string
  validityPeriod?: string
  licenseExpired?: boolean
}

export interface LicenseDetailsState {
  item: LicenseDetailsItem
  loading: boolean
}

const initialState: LicenseDetailsState = {
  item: {},
  loading: true,
}

const licenseDetailsSlice = createSlice({
  name: 'licenseDetails',
  initialState,
  reducers: {
    getLicenseDetails: (state) => ({
      ...state,
      loading: true,
    }),
    getLicenseDetailsResponse: (
      state,
      action: PayloadAction<{ data?: LicenseDetailsItem } | null>,
    ) => {
      if (action.payload?.data) {
        return {
          ...state,
          item: {
            ...action.payload.data,
            companyName: action.payload.data?.companyName
              ? action.payload.data?.companyName.replace(/"/g, '')
              : '',
            customerFirstName: action.payload.data?.customerFirstName
              ? action.payload.data?.customerFirstName.replace(/"/g, '')
              : '',
            customerLastName: action.payload.data?.customerLastName
              ? action.payload.data?.customerLastName.replace(/"/g, '')
              : '',
            customerEmail: action.payload.data?.customerEmail
              ? action.payload.data?.customerEmail.replace(/"/g, '')
              : '',
          },
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }
    },
    updateLicenseDetails: (state) => ({
      ...state,
      loading: true,
    }),
    updateLicenseDetailsResponse: (
      state,
      action: PayloadAction<{ data?: LicenseDetailsItem } | null>,
    ) => {
      if (action.payload?.data) {
        return {
          ...state,
          item: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }
    },
    setLicenseReset: (state) => {
      state.loading = true
    },
    setLicenseResetResponse: (state) => {
      state.loading = false
      state.item.licenseExpired = true
    },
    setLicenseResetFailure: (state) => {
      state.loading = false
    },
  },
})

export const {
  getLicenseDetails,
  getLicenseDetailsResponse,
  updateLicenseDetails,
  updateLicenseDetailsResponse,
  setLicenseReset,
  setLicenseResetResponse,
  setLicenseResetFailure,
} = licenseDetailsSlice.actions
export const { actions, reducer } = licenseDetailsSlice
reducerRegistry.register('licenseDetailsReducer', reducer)
