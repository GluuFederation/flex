import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  agamaList: [],
  loading: false,
  fileLoading:false,
  totalItems: 0,
  entriesCount: 0,
  agamaRepostoriesList:[],
  agamaFileResponse:null
}

const agamaSlice = createSlice({
  name: 'agama',
  initialState,
  reducers: {
    getAgama: (state) => {
      state.loading = true
    },
    getAgamaResponse: (state, action) => {
      state.loading = false
      if (action.payload) {
        state.totalItems = action.payload.totalEntriesCount || 0
        state.entriesCount = action.payload.entriesCount || 0
        state.agamaList = action.payload.entries || []
      }
    },
    deleteAgama: (state) => {
      state.loading = true
    },
    addAgama: (state) => {
      state.loading = true
    },
    getAddAgamaResponse: (state) => {
      state.loading = false
    },
    getAgamaRepository: (state) => {
     state.fileLoading = true
    },
    getAgamaRepositoryFile: (state,action) => {
      state.fileLoading = true
     },
    getAgamaRepositoriesResponse: (state, action) => {
      state.fileLoading = false
      if (action.payload) {
        state.agamaRepostoriesList = action.payload || []
      }
    },
    getAgamaRepositoryFileResponse: (state, action) => {
      state.fileLoading = false
      if (action.payload) {
        state.agamaFileResponse = action.payload || []
      }
    }

  }
})

export const {
  getAgama,
  getAgamaResponse,
  deleteAgama,
  addAgama,
  getAddAgamaResponse,
  getAgamaRepository,
  getAgamaRepositoriesResponse,
  getAgamaRepositoryFile,
  getAgamaRepositoryFileResponse
} = agamaSlice.actions
export { initialState }
export const { actions, reducer, state } = agamaSlice
reducerRegistry.register('agamaReducer', reducer)
