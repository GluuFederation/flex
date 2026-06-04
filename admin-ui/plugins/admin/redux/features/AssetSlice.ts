import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AssetState } from './types/asset'
import { Document } from '../../components/Assets/types/AssetApiTypes'

const initialState: AssetState = {
  selectedAsset: {},
}

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setSelectedAsset: (state, action: PayloadAction<Document | Record<string, never>>) => {
      state.selectedAsset = action.payload
    },
  },
})

export const { setSelectedAsset } = assetSlice.actions

export const { reducer } = assetSlice
reducerRegistry.register('assetReducer', reducer)
