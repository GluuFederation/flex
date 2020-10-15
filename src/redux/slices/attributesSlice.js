import { createSlice } from "@reduxjs/toolkit";

const attributesSlice = createSlice({
  name: "attributes",
  initialState: [],
  reducers: {
    list: (state, action) => {
      state.attributes = action.payload;
    },
    add: (state, action) => {}
  }
});

export const { list, add } = attributesSlice.actions;
export default attributesSlice.reducer;
