import { createRoot } from 'react-dom/client'
import App from './components/App'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { ThemeProvider } from 'Context/theme/themeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryDefaults } from '@/utils/queryUtils'
import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      ...queryDefaults.queryOptions,
    },
  },
})

const container = document.querySelector('#root') as HTMLElement
const root = createRoot(container)

root.render(
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </I18nextProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
)
