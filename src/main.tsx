import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import App from './App'
import AppProvider from './contexts/appContext'
import '~/assets/styles/index.scss'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <AppProvider>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
        </AppProvider>
    </QueryClientProvider>
    // </React.StrictMode>
)
