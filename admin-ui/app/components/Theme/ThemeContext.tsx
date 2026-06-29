import React from 'react'

import type { ThemeContextState } from './types'

const ThemeContext = React.createContext<ThemeContextState | null>(null)

export { ThemeContext }
