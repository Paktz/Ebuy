import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../components/layout/Layout'
import { AuthProvider } from '../context/AuthContext'

// Create a client
const queryClient = new QueryClient()

// Optional: Create a custom theme by extending the default theme
const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
  },
  fonts: {
    ...theme.fonts,
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
  },
  config: {
    ...theme.config,
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
export default MyApp