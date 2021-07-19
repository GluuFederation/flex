import {
  GET_MAU,
} from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'
const INIT_STATE = {
  acrs: {},
  tests: [],
  loading: true,
}

const reducerName = 'testReducer';

export default function testReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_MAU:
      return {
        ...state,
        loading: true,
      }
    default:
      return {
        ...state,
      }
  }
}
reducerRegistry.register(reducerName, testReducer)

