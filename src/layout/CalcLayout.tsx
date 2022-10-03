import Head from 'next/head'
import Image from 'next/image'
// My Project
import Footer from '../components/Footer'
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
      <div className={ styles['box-img'] }>
        <Image
          src="/images/sara-dubler-oo1COphDN8w-unsplash.jpg"
          alt="Pote de açaí"
          layout='fill'
          objectFit="cover"
        />
      </div>
      <div className={ styles['display-nav'] }>
        { children }
      </div>
    </main>
    <Footer />
  </>
}
