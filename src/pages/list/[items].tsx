import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Router, useRouter } from 'next/router'
// My Project
import DisplayPart from '../../partials/DisplayPart'
import { IData, IItem, IItemMax } from '../../types'
import { apiClientGetData } from '../../client/services/apiService'
import { Route } from 'next/dist/server/router'

let dataCache: IData
let render: JSX.Element |  JSX.Element[]
let listSizes: string[]
let listPlus: string[]
function List() {
  // Handling URL params
  const router = useRouter()
  listSizes = []
  listPlus = []
  if(router.query.items && typeof router.query.items == "string") {
    for(let param of router.query.items.split("+")) {
      if(param.match('size')) {
        listSizes.push(param)
      }
      if(param.match('plus')) {
        listPlus.push(param)
      }
    }
  }

  // Handling datas
  const [error, setError] = useState<Error>()
  const [sizes, setSizes] = useState<IItem[]>()
  const [plus, setPlus] = useState<IItemMax>()
  const [triggerCache, setTriggerCache] = useState<boolean>()
  useEffect(() => {
    if(!sessionStorage.getItem("DataString")) {
      apiClientGetData()
      .then(res => {
        setSizes(res.sizes)
        setPlus(res.plus)
        sessionStorage.setItem("DataString", JSON.stringify(res))
        setTriggerCache(true)
      })
      .catch(e => setError(e))
    } else {
      dataCache = JSON.parse(sessionStorage.getItem("DataString")!)
      // Handling sizes list
      if(listSizes.length) {
        dataCache.sizes = dataCache.sizes.map(el => {
          return el.id === listSizes[0] ? { ...el, checked: true } : { ...el, checked: false }
        })
        if(dataCache.sizes.map(e => e.checked).every(e => e === false)) {
          dataCache.sizes[0].checked = true
        }
      }
      // Handling plus list
      dataCache.plus.items = dataCache.plus.items.map(el => {
        return { ...el, checked: false }
      })
      if(listPlus.length) {
        for(let itemPlus of listPlus.slice(0, dataCache.plus.max)) {
          dataCache.plus.items = dataCache.plus.items.map(el => {
            return el.id === itemPlus ? { ...el, checked: true } : { ...el }
          })
        }
      }
      setSizes(dataCache.sizes)
      setPlus(dataCache.plus)
      // Refresh cache
      sessionStorage.setItem("DataString", JSON.stringify(dataCache))
      setTriggerCache(false)
    }
  }, [router, triggerCache])

  // Handling prints
  render = <h3>Carregando...</h3>

  if(error) {
    render = <h3>Erro ao tentar carregar dados</h3>
  }

  if(!error && sizes && plus) {
    render = <>
      <h1 className='title'>Calcule seu Açaí</h1>
      <h2>Pedido</h2>
      <ul>
        { sizes.filter(el => el.checked).map(el => <li key={ el.id }><span>{ el.desc }</span><span>{ el.price }</span></li>) }
        { plus.items.filter(el => el.checked).map(el => <li key={ el.id } ><span>{ el.desc }</span><span>{ el.price }</span></li>) }
      </ul>
      <Link href="/">
        <button>Cardápio</button>
      </Link>
    </>
  }

  return <>
    <Head>
      <title>Açaí App - Pedido</title>
    </Head>
    <DisplayPart>
      { render }
    </DisplayPart>
  </>
}

export default List
