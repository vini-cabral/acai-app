import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// My Project
import Display from '../../components/Display'
import { IData, IItem, IItemMax } from '../../types'
import { apiClientGetData } from '../../client/services/apiService'
import Loading from '../../components/Loading'
import Error from '../../components/Error'

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
  render = <Loading />

  if(error) {
    render = <Error>
      <h3>Ops, algo deu errado!</h3>
      <p>Não foi possível fazer o carregamento de dados.</p>
    </Error>
  }

  if(!error && sizes && plus) {
    render = <>
      <h1 className='title'>Calcule seu Açaí</h1>
      <h2 className='sub-title'>Pedido</h2>
      <ul className='list-menu'>
        { 
          sizes.filter(el => el.checked).map(el => <li key={ el.id } className='item-menu'>
            <span>{ el.desc }</span>
            <span style={ {marginLeft: "auto"}}>{ `R$ ${el.price.toFixed(2).replace(".",",")}` }</span>
          </li>)
        }
        {
          plus.items.filter(el => el.checked).map(el => <li key={ el.id } className='item-menu'>
            <span>{ el.desc }</span>
            <span style={ {marginLeft: "auto"}}>{ `R$ ${el.price.toFixed(2).replace(".",",")}` }</span>
          </li>)
        }
        <li className='total'>
            <span>Total</span>
            <span >{ `R$ ${
              sizes.filter(el => el.checked)
            }` }</span>
        </li>
      </ul>
      <Link href="/">
        <button className='btn-calc'>Cardápio</button>
      </Link>
    </>
  }

  return <>
    <Head>
      <title>Açaí App - Pedido</title>
    </Head>
    <Display>
      { render }
    </Display>
  </>
}

export default List
