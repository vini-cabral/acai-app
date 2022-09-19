import '../styles/globals.css'
import type { AppProps } from 'next/app'
// My Project
import CalcLayout from '../layout/CalcLayout'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <CalcLayout>
      <Component {...pageProps} />
    </CalcLayout>
  </>
}

export default MyApp
