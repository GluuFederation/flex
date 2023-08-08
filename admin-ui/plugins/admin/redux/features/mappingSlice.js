import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  serverItems: [],
  loading: false
}

const mappingSlice = createSlice({
    name: 'mapping',
    initialState,
    reducers: {
      getMapping: (state, action) => handleLoading(state),
      getMappingResponse: (state, action) => {
        if (action.payload.data) {
          return handleItems(state, action.payload.data);
        } else {
          return handleDefault(state);
        }
      },
      addPermissionsToRole: (state, action) => {
        const { data, userRole } = action.payload.data;
        let roleIndex = state.items.findIndex((element) => element.role === userRole);
        let existingPermissions = state.items[roleIndex].permissions;
        let newArr = existingPermissions.concat(data);
        let addedPermissions = state.items;
        addedPermissions[roleIndex].permissions = newArr;
        state.items = [...addedPermissions]
      },
      updatePermissionsLoading: (state, action) => ({
        ...state,
        loading: action.payload.data,
      }),
      updatePermissionsServerResponse: (state, action) => {
        let indexToUpdatePermissions = state.items.findIndex(
          (element) => element.role === action.payload?.data?.role,
        );
        let changedData = state.items;
        changedData[indexToUpdatePermissions] = action.payload?.data;
        state.items = [...changedData]
        state.loading = false
      },
      updateMapping: (state, action) => {
        if (action.payload?.data) {
          const { id, role } = action.payload.data;
          let index = state.items.findIndex((element) => element.role === role);
          let permissions = state.items[index].permissions;
          permissions.splice(id, 1);
          let changedPermissions = state.items;
          changedPermissions[index].permissions = permissions;
          state.items = [...changedPermissions]
        }
      },
      updatePermissionsToServer: (state, action) => {},
      addNewRolePermissions: (state, action) => {},
      deleteMapping: (state, action) => {},
    },
  });
  
  function handleItems(state, data) {
    return {
      ...state,
      items: data,
      loading: false,
    };
  }
  
  function handleLoading(state) {
    return {
      ...state,
      loading: true,
    };
  }
  
  function handleDefault(state) {
    return {
      ...state,
      loading: false,
    };
  }
  
  export const {
    getMapping,
    getMappingResponse,
    addPermissionsToRole,
    updatePermissionsLoading,
    updatePermissionsServerResponse,
    updateMapping,
    updatePermissionsToServer,
    addNewRolePermissions,
    deleteMapping
  } = mappingSlice.actions;
export { initialState }
export const { actions, reducer, state } = mappingSlice
reducerRegistry.register('mappingReducer', reducer)
