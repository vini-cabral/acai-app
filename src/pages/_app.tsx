import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
// My Project
import CalcLayout from '../layout/CalcLayout'
import dataContext from '../context'
import { IItem, IItemMax } from '../types'

function MyApp({ Component, pageProps }: AppProps) {
  const [sizes, setSizes] = useState<IItem[] | null>(null)
  const [plus, setPlus] = useState<IItemMax | null>(null)
  return <>
    <CalcLayout>
      <dataContext.Provider value={{sizes, setSizes, plus, setPlus}}>
        <Component {...pageProps} />
      </dataContext.Provider>
    </CalcLayout>
  </>
}

export default MyApp
