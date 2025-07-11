import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  type: '',
  loading: false,
  // New database information state
  databaseInfo: {
    databaseName: '',
    schemaName: '',
    productName: '',
    productVersion: '',
    driverName: '',
    driverVersion: '',
  },
  databaseInfoLoading: false,
}

const persistenceTypeSlice = createSlice({
  name: 'persistenceType',
  initialState,
  reducers: {
    getPersistenceType: (state) => {
      state.loading = true
    },
    getPersistenceTypeResponse: (state, action) => {
      state.type = action.payload?.data || ''
      state.loading = false
    },
    // New database information actions
    getDatabaseInfo: (state) => {
      state.databaseInfoLoading = true
    },
    getDatabaseInfoResponse: (state, action) => {
      if (action.payload?.data) {
        const responseData = action.payload.data

        state.databaseInfo = {
          databaseName: responseData.databaseName || '',
          schemaName: responseData.schemaName || '',
          productName: responseData.productName || '',
          productVersion: responseData.productVersion || '',
          driverName: responseData.driverName || '',
          driverVersion: responseData.driverVersion || '',
        }
      }
      state.databaseInfoLoading = false
    },
  },
})

export const {
  getPersistenceType,
  getPersistenceTypeResponse,
  getDatabaseInfo,
  getDatabaseInfoResponse,
} = persistenceTypeSlice.actions

export const { reducer, actions } = persistenceTypeSlice
