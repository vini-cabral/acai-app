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

type ListOrder = {
  id: string
  desc: string
  price: number
}

let dataCache: IData
let render: JSX.Element |  JSX.Element[]
let listSizes: string[]
let listPlus: string[]

function List() {
  const router = useRouter()
  listSizes = []
  listPlus = []
  const [error, setError] = useState<Error>()
  const [listOrder, setListOrder] = useState<ListOrder[]>()
  const [checkCache, setCheckCache] = useState<boolean>()

  useEffect(() => {
    // Handling URL params
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
    // Handling Datas
    if(sessionStorage.getItem("DataString")) {
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
      setListOrder([
        ...dataCache.sizes.filter(el => el.checked && { id: el.id ,desc: el.desc, price: el.price }),
        ...dataCache.plus.items.filter(el => el.checked && { id: el.id ,desc: el.desc, price: el.price })
      ])
      sessionStorage.setItem("DataString", JSON.stringify(dataCache))
      setCheckCache(false)
    } else {
      apiClientGetData()
      .then(res => {
        setListOrder([
          ...res.sizes.filter(el => el.checked && { id: el.id ,desc: el.desc, price: el.price }),
          ...res.plus.items.filter(el => el.checked && { id: el.id ,desc: el.desc, price: el.price })
        ])
        sessionStorage.setItem("DataString", JSON.stringify(res))
        setCheckCache(true)
      })
      .catch(e => setError(e))
    }
  }, [router, checkCache])

  render = <Loading />

  if(error) {
    render = <Error>
      <h3>Ops, algo deu errado!</h3>
      <p>Não foi possível fazer o carregamento de dados.</p>
    </Error>
  }

  if(!error && listOrder) {
    render = <>
      <h1 className='title'>Calcule seu Açaí</h1>
      <h2 className='sub-title'>Pedido</h2>
      <ul className='list-menu'>
        { 
          listOrder.map(el => <li key={ el.id } className='item-menu'>
            <span>{ el.desc }</span>
            <span style={ {marginLeft: "auto"}}>{ `R$ ${el.price.toFixed(2).replace(".",",")}` }</span>
          </li>)
        }
        <li className='total'>
            <span>Total</span>
            <span >{
              `R$ ${ listOrder
                .map(el => el.price)
                .reduce((a:number,b:number) => a + b).toFixed(2).replace(".",",")}` 
              }
            </span>
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
