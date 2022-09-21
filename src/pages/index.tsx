import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
// My Project
import Display from '../components/Display'
import { IItem, IItemMax } from '../types'
import { apiClientGetData } from '../client/apiServiceClient'
import Loading from '../components/Loading'
import Error from '../components/Error'

function generateParams(sizes: IItem[], plusItems: IItem[]): string {
  let path = ''
  sizes.forEach(el => {
    if(el.checked) {
      path += `+${el.id}`
    }
  })
  plusItems.forEach(el => {
    if(el.checked) {
      path += `+${el.id}`
    }
  })
  return path.substring(1)
}

function renderHelp(value: number, max: number, className: any) {
  if(value == 1) {
    return <h3 className={ className }>{ value } item escolhido.</h3>
  } else if (value > 1) {
    return <h3 className={ className }>{ value } itens escolhidos.</h3>
  } else {
    return <h3 className={ className }>Escolha até { max } itens.</h3>
  }
}

let render: JSX.Element |  JSX.Element[]
function Home() {
  const [error, setError] = useState<Error>()
  const [sizes, setSizes] = useState<IItem[]>()
  const [plus, setPlus] = useState<IItemMax>()
  const [totalSelect, setTotalSelect] = useState(0)

  useEffect(() => {
    if(sessionStorage.getItem("DataString")) {
      setSizes(JSON.parse(sessionStorage.getItem("DataString")!).sizes)
      setPlus(JSON.parse(sessionStorage.getItem("DataString")!).plus)
    } else {
      apiClientGetData()
      .then(res => {
        setSizes(res.sizes)
        setPlus(res.plus)
        sessionStorage.setItem("DataString", JSON.stringify(res))
      })
      .catch(e => setError(e))
    }
  }, [])

  useEffect(() => {
    if(plus) {
      setTotalSelect(plus.items.filter(el => el.checked).length)
    }
  }, [plus])

  render = <Loading />

  if(error) {
    render = <Error>
      <h3>{ error.name }</h3>
      <p>{ error.message }</p>
    </Error>
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
      { renderHelp(totalSelect, plus.max, 'sub-title-help') }
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
      <Link href={`/list/${ generateParams(sizes, plus.items) }`}>
        <button className='btn-calc'>Calcular</button>
      </Link>
    </>
  }

  return <>
    <Head>
      <title>Açaí App - Cardápio</title>
    </Head>
    <Display>
      { render }
    </Display>
  </>
}

export default Home
