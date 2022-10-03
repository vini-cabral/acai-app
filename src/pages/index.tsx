import Head from 'next/head'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
// My Project
import Display from '../components/Display'
import { IItem, IItemMax } from '../types'
import { apiClientGetData } from '../client/apiServiceClient'
import Loading from '../components/Loading'
import ErrorDialog from '../components/ErrorDialog'
import dataContext from '../context'

function handlerApiData(
  sizes: IItem[] | null, plus: IItemMax | null, setSizes: Function, setPlus: Function, setError: Function
): void {
  if(sizes === null && plus === null) {
    apiClientGetData()
    .then(res => {
      if(res.sizes.every( el => el.checked === false)) {
        res.sizes[0].checked= true
      }
      setSizes(res.sizes)
      setPlus(res.plus)
    })
    .catch(e => setError(e))
  }
}

function handlerDynamicURL(sizes: IItem[], plusItems: IItem[]): string {
  let path = ''
  sizes.forEach(el => {
    if(el.checked) {
      path += `/${el.id}`
    }
  })
  plusItems.forEach(el => {
    if(el.checked) {
      path += `/${el.id}`
    }
  })
  return path.substring(1)
}

function UserHelpComponent({value, max, classAdd}: {value: number, max: number, classAdd: any}) {
  if(value == 1) {
    return <h3 className={ classAdd }>{ value } item escolhido.</h3>
  } else if (value > 1) {
    return <h3 className={ classAdd }>{ value } itens escolhidos.</h3>
  } else {
    return <h3 className={ classAdd }>Escolha até { max } itens.</h3>
  }
}

let render: JSX.Element |  JSX.Element[]
function MenuComponent({
  error, sizes, plus, setSizes, setPlus, totalSelect
}:{
  error?:Error, sizes:IItem[] | null, plus:IItemMax | null, setSizes:Function, setPlus:Function, totalSelect:number
}) {
  render = <Loading />

  if(error) {
    render = <ErrorDialog>
      <h3>{ error.name }</h3>
      <p>{ error.message }</p>
    </ErrorDialog>
  }

  if(!error && sizes && plus) {
    render = <>
      <h1 className='title'>Calcule seu Açaí</h1>
      <h2 className='sub-title'>Porção</h2>
      <h3 className='sub-title-help'>Escolha uma das opções abaixo:</h3>
        <div className='list-menu'>{
          sizes.map((el1, i1) => <label key={ el1.id } className='item-menu'>
            <input
              type="radio"
              id={ el1.id }
              name={ el1.name }
              value={ el1.desc }
              checked={ el1.checked }
              onChange={ () => {
                setSizes(sizes.map((el2, i2) => {
                  return i1 === i2 ? { ...el2, checked: true} : { ...el2, checked: false}
                }))
              } }
            />
            <span>{ el1.desc }</span>
            <span>{ `R$ ${el1.price.toFixed(2).replace(".",",")}` }</span>
          </label>)
        }</div>
      <h2 className='sub-title'>Acréscimos</h2>
      <UserHelpComponent value={totalSelect} max={plus.max} classAdd={'sub-title-help'}/>
      <div className='list-menu'>{
        plus.items.map(el => <label key={ el.id } className='item-menu'>
            <input
              type="checkbox"
              id={ el.id }
              name={ el.name }
              value={ el.desc }
              checked={ el.checked }
              disabled={ totalSelect >= plus.max && !el.checked ? true : false }
              onChange={ () => {
                el.checked = !el.checked
                setPlus({...plus})
              } }
            />
            <span>{ el.desc }</span>
            <span>{ `R$ ${el.price.toFixed(2).replace(".",",")}` }</span>
          </label>
        )
      }</div>
      <Link href={`/list/${ handlerDynamicURL(sizes, plus.items) }`}>
        <button className='btn-calc'>Calcular</button>
      </Link>
    </>
  }

  return render
}

function Home() {
  const {sizes, setSizes, plus, setPlus} = useContext(dataContext)
  const [error, setError] = useState<Error>()
  const [totalSelect, setTotalSelect] = useState(0)

  useEffect(() => {
    handlerApiData(sizes, plus, setSizes, setPlus, setError)
  }, [plus, setPlus, sizes, setSizes])

  useEffect(() => {
    if(plus) {
      setTotalSelect(plus.items.filter(el => el.checked).length)
    }
  }, [plus])

  return <>
    <Head>
      <title>Açaí App - Cardápio</title>
    </Head>
    <Display>
      <MenuComponent error={error} sizes={sizes} plus={plus} setSizes={setSizes} setPlus={setPlus} totalSelect={totalSelect}/>
    </Display>
  </>
}

export default Home
