// @ts-nocheck
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  item: {},
  loading: true
}

const licenseDetailsSlice = createSlice({
  name: 'licenseDetails',
  initialState,
  reducers: {
    getLicenseDetails: (state) => ({
      ...state,
      loading: true
    }),
    getLicenseDetailsResponse: (state, action) => {
      if (action.payload?.data) {
        return {
          ...state,
          item: { 
            ...action.payload.data, 
            companyName: action.payload.data?.companyName ? action.payload.data?.companyName.replace(/"/g , '') : '', 
            customerFirstName: action.payload.data?.customerFirstName ? action.payload.data?.customerFirstName.replace(/"/g , '') : '',
            customerLastName: action.payload.data?.customerLastName ? action.payload.data?.customerLastName.replace(/"/g , '') : '',
            customerEmail: action.payload.data?.customerEmail ? action.payload.data?.customerEmail.replace(/"/g , '') : ''
          },
          loading: false
        }
      } else {
        return {
          ...state,
          loading: false
        }
      }
    },
    updateLicenseDetails: (state) => ({
      ...state,
      loading: true
    }),
    updateLicenseDetailsResponse: (state, action) => {
      if (action.payload?.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false
        }
      } else {
        return {
          ...state,
          loading: false
        }
      }
    }
  }
})

export const {
  getLicenseDetails,
  getLicenseDetailsResponse,
  updateLicenseDetails,
  updateLicenseDetailsResponse
} = licenseDetailsSlice.actions
export const { actions, reducer, state } = licenseDetailsSlice
reducerRegistry.register('licenseDetailsReducer', reducer)
