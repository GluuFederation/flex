import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from './components/App'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { ThemeProvider } from 'Context/theme/themeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryDefaults } from '@/utils/queryUtils'
import { configStore } from 'Redux/store'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.css'

const { store, persistor } = configStore()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...queryDefaults.queryOptions,
      retry: false,
    },
  },
})

const container = document.querySelector('#root') as HTMLElement
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <PersistGate loading={<GluuLoader blocking />} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </I18nextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </PersistGate>
  </Provider>,
)
