import Head from 'next/head'
// My Project
import FooterPart from '../partials/FooterPart'
import styles from './CalcLayout.module.css'

type Props = {
  children?: JSX.Element | JSX.Element[]
}

export default function CalcLayout({ children }: Props) {
  return <>
    <Head>
      <meta name="keywords" content="react, typescript, api, nextjs" />
      <meta name="description" content="NextJS App" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    </Head>
    <main className={ styles['main'] }>
      <img className={ styles['bg-img'] } src="/images/sara-dubler-oo1COphDN8w-unsplash.jpg" alt="Pote de açaí" />
      <div className={ styles['display-nav'] }>
        { children }
      </div>
    </main>
    <FooterPart />
  </>
}
