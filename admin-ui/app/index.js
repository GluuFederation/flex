import '@babel/polyfill'
import React from 'react'
import { render } from 'react-dom'
import App from 'Components/App'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { ThemeProvider } from 'Context/theme/themeContext'
import './styles/index.css'

render(
  <I18nextProvider i18n={i18n}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </I18nextProvider>,
  document.querySelector('#root'),
)
