import React from 'react'

import type { ThemeContextState } from './types'

const { Provider, Consumer } = React.createContext<ThemeContextState | null>(null)

export { Provider, Consumer }
export type { ThemeContextState } from './types'
