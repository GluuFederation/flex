import { USER_LOGGED_OUT } from '../actions/types'
import reducerRegistry from './ReducerRegistry'

const reducerName = 'logoutReducer'

const INIT_STATE = {}

export default function logoutReducer(state = INIT_STATE, action) {
  if (action.type === USER_LOGGED_OUT) {
    const initTheme = localStorage.getItem('initTheme')
    const initLang = localStorage.getItem('initLang')
    const userConfig = localStorage.getItem('userConfig')
    localStorage.clear()
    localStorage.setItem('initTheme', initTheme)
    localStorage.setItem('initLang', initLang)
    localStorage.setItem('userConfig', userConfig)
  }
  return state
}

reducerRegistry.register(reducerName, logoutReducer)