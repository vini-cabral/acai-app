import Head from 'next/head'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// My Project
import Display from '../../components/Display'
import Loading from '../../components/Loading'
import ErrorDialog from '../../components/ErrorDialog'
import dataContext from '../../context'
import { IItem, IItemMax } from '../../types'
import { apiClientGetData } from '../../client/apiServiceClient'

type List = {
  id: string
  desc: string
  price: number
}
type ListOrder = {
  print: boolean
  list?: List[]
}

function handlerApiData(
  sizes: IItem[] | null,
  plus: IItemMax | null,
  setSizes: Function,
  setPlus: Function,
  setError: Function,
  URLParams: string[]
): void {
  if(sizes === null && plus === null) {
    apiClientGetData()
    .then(res => {
      URLParams = URLParams.slice(0, res.plus.max + 1)
      for(let param of URLParams) {
        if(param.match('size')) {
          res.sizes = res.sizes.map(el => el.id === param ? { ...el, checked: true } : { ...el })
        }
        if(param.match('plus')) {
          res.plus.items = res.plus.items.map(el => el.id === param ? { ...el, checked: true } : { ...el })
        }
      }
      if(res.sizes.every( el => el.checked === false)) {
        res.sizes[0].checked= true
      }
      setSizes(res.sizes)
      setPlus(res.plus)
    })
    .catch(e => setError(e))
  }
}

let render: JSX.Element |  JSX.Element[]
let listRender: JSX.Element |  JSX.Element[]
function OrderComponent({ error, listOrder }:{ error?:Error, listOrder?:ListOrder }) {
  render = <Loading />

  if(error) {
    render = <ErrorDialog>
      <h3>{ error.name }</h3>
      <p>{ error.message }</p>
    </ErrorDialog>
  }

  if(!error && listOrder) {
    if(listOrder.print && listOrder.list) {
      listRender = <ul className='list-menu'>
        { 
          listOrder.list.map(el => <li key={ el.id } className='item-menu'>
            <span>{ el.desc }</span>
            <span style={ {marginLeft: "auto"}}>{ `R$ ${el.price.toFixed(2).replace(".",",")}` }</span>
          </li>)
        }
        <li className='total'>
            <span>Total</span>
            <span >{
              `R$ ${ listOrder.list
                .map(el => el.price)
                .reduce((a:number,b:number) => a + b).toFixed(2).replace(".",",")}` 
              }
            </span>
        </li>
      </ul>
    } else {
      listRender = <ul className='list-menu'>
        <li className='item-menu'>
            <span style={{marginRight: "auto"}}>Lista Vazia</span>
          </li>
      </ul>
    }

    render = <>
      <h1 className='title'>Calcule seu Açaí</h1>
      <h2 className='sub-title'>Pedido</h2>
      { listRender }
      <Link href="/">
        <button className='btn-calc'>Cardápio</button>
      </Link>
    </>
  }

  return render
}

function List() {
  const router = useRouter()
  const {sizes, setSizes, plus, setPlus} = useContext(dataContext)
  const [error, setError] = useState<Error>()
  const [listOrder, setListOrder] = useState<ListOrder>()

  useEffect(() => {
    if(router.query.index) {
      handlerApiData(
        sizes, plus, setSizes, setPlus, setError,
        typeof router.query.index === 'string' ? [router.query.index] : router.query.index
      )
    } else {
      setListOrder({ print: false })
    }
  }, [router.query, plus, setPlus, setSizes, sizes])

  useEffect(() => {
    if(sizes && plus) {
      setListOrder({
        print: true,
        list: [
          ...sizes.filter(el => el.checked && { id: el.id, desc: el.desc, price: el.price }),
          ...plus.items.filter(el => el.checked && { id: el.id, desc: el.desc, price: el.price })
        ]
      })
    }
  }, [plus, sizes])

  return <>
    <Head>
      <title>Açaí App - Pedido</title>
    </Head>
    <Display>
      <OrderComponent error={error} listOrder={listOrder}/>
    </Display>
  </>
}

export default List
