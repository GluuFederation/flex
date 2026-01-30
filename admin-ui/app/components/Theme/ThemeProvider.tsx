import React, { ReactNode } from 'react'

import { Provider } from './ThemeContext'
import { THEME_LIGHT } from '@/context/theme/constants'

interface ThemeProviderProps {
  children?: ReactNode
  initialStyle?: string
  initialColor?: string
}

interface ThemeProviderState {
  style: string
  color: string
}

export class ThemeProvider extends React.Component<ThemeProviderProps, ThemeProviderState> {
  constructor(props: ThemeProviderProps) {
    super(props)

    this.state = {
      style: THEME_LIGHT,
      color: 'primary',
    }
  }

  componentDidMount() {
    const { initialStyle, initialColor } = this.props

    if (initialStyle) {
      this.setState({ style: initialStyle })
    }
    if (initialColor) {
      this.setState({ color: initialColor })
    }
  }

  onChangeTheme(themeState: Partial<ThemeProviderState>) {
    this.setState((prevState) => ({
      ...prevState,
      ...themeState,
    }))
  }

  render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          ...this.state,
          onChangeTheme: this.onChangeTheme.bind(this),
        }}
      >
        {children}
      </Provider>
    )
  }
}
