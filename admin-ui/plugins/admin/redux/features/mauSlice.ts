import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'
import type { MauState } from 'Redux/types'

const initialState: MauState = {
  stat: [],
  loading: false,
  startMonth: '',
  endMonth: '',
}

const mauSlice = createSlice({
  name: 'mau',
  initialState,
  reducers: {},
})

export const { actions, reducer } = mauSlice
reducerRegistry.register('mauReducer', reducer)
