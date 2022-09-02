import { USER_LOGGED_OUT } from '../actions/types'
import reducerRegistry from './ReducerRegistry'

const reducerName = 'logoutReducer'

const INIT_STATE = {}

export default function logoutReducer(state = INIT_STATE, action) {
  if (action.type === USER_LOGGED_OUT) {
    const userConfig = localStorage.getItem('userConfig')
    localStorage.clear()
    localStorage.setItem('initTheme', 'darkBlack')
    localStorage.setItem('initLang', 'en')

    if (userConfig && userConfig !== 'null') {
      localStorage.setItem('userConfig', userConfig)
    }
  }
  return state
}

reducerRegistry.register(reducerName, logoutReducer)