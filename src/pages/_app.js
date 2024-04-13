import '@/styles/globals.css'
import { AppProvider } from '@/hooks/useAppContext'

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  )

}
