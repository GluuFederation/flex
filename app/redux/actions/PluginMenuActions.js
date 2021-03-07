/**
 * Plugin Actions
 */
import {
	GET_ALL_PLUGIN_MENU,
	GET_ALL_PLUGIN_MENU_RESPONSE,
} from './types'

export const getAllPlugins = () => ({
  type: GET_ALL_PLUGIN_MENU,
})

export const getAllPluginResponse = (plugins) => ({
  type: GET_ALL_PLUGIN_MENU_RESPONSE,
  payload: { plugins },
})

