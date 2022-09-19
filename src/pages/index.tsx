import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
// My Project
import DisplayPart from '../partials/DisplayPart'
import { IItem, IItemMax } from '../types'
import { apiClientGetData } from '../client/services/apiService'

function generateParams(sizes: IItem[], plusItems: IItem[]): string {
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
  return path
}

function generateParams1(sizes: IItem[], plusItems: IItem[]): string {
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

  render = <h3>Carregando...</h3>

  if(error) {
    render = <h3>Erro ao tentar carregar dados</h3>
  }

  if(!error && sizes && plus) {
    render = <>
      <h1 className='title'>Calcule seu Açaí</h1>
      <h2>Porção</h2>
        <div>{
          sizes.map((el1, i1) => <label key={ el1.id }>
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
            />{ el1.desc }
          </label>)
        }</div>
      <h2>Acréscimos</h2>
      <div>{
        plus.items.map(el => <label key={ el.id }>
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
            />{ el.desc }
          </label>
        )
      }</div>
      <Link href={`/list/${ generateParams1(sizes, plus.items) }`}>
        <button>Calcular</button>
      </Link>
    </>
  }

  return <>
    <Head>
      <title>Açaí App - Cardápio</title>
    </Head>
    <DisplayPart>
      { render }
    </DisplayPart>
  </>
}

export default Home
