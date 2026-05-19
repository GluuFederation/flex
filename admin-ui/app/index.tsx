import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from './components/App'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { ThemeProvider } from 'Context/theme/themeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryDefaults } from '@/utils/queryUtils'
import { configStore } from 'Redux/store'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.css'

// react-query devtools — dev only; the dynamic import is statically dropped from the production bundle.
const ReactQueryDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-query-devtools').then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )

if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
  const originalStartViewTransition = document.startViewTransition.bind(document)
  document.startViewTransition = (callback) => {
    document.body.classList.add('view-transition-active')
    const transition = originalStartViewTransition(callback)
    transition.finished.finally(() => document.body.classList.remove('view-transition-active'))
    return transition
  }
}

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
        <Suspense fallback={null}>
          <ReactQueryDevtools />
        </Suspense>
      </QueryClientProvider>
    </PersistGate>
  </Provider>,
)
