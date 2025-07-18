import { createRoot } from 'react-dom/client'
import App from './components/App'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { ThemeProvider } from 'Context/theme/themeContext'
import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.css'

const container = document.querySelector('#root') as HTMLElement
const root = createRoot(container)

root.render(
  <I18nextProvider i18n={i18n}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </I18nextProvider>,
)
