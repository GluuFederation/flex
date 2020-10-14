import { createSlice } from "@reduxjs/toolkit";
import initialState from "./../store/state";

class ReducerFactory {
  constructor(slice, state) {
    const reducerResult = createSlice({
      name: slice,
      initialState: initialState[state],
      reducers: this._generateReducers()
    });

    this.reducer = reducerResult.reducer;
    this.actions = reducerResult.actions;
  }

  _generateReducers = () => {
    return {
      // get our list of items
      requestGetItems: (state, action) => {
        state.isLoading = true;
      },
      requestGetItemsSuccess: (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      },
      requestGetItemsError: (state, action) => {
        state.isLoading = false;
      }
    };
  };
}

export default ReducerFactory