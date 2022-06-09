import '@babel/polyfill'
import React from 'react'
import { render } from 'react-dom'
import App from 'Components/App'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n';

render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>,
  document.querySelector('#root'),
)
