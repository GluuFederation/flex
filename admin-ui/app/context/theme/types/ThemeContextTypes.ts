import type { Dispatch } from 'react'
import type { ThemeValue } from '../constants'

export type ThemeState = {
  theme: ThemeValue
}

export type ThemeAction = {
  type: ThemeValue
}

export type ThemeContextType = {
  state: ThemeState
  dispatch: Dispatch<ThemeAction>
}
