import Link from 'next/link'
// My Project
import styles from './Footer.module.css'

export default function Footer() {
  return <footer className={ styles['footer'] }>
    <p>
      Veja o autor do{" "}
      <Link href="https://github.com/vini-cabral/acai-app">
        <a>projeto</a>
      </Link>,{" "}
      <Link href="https://github.com/vini-cabral">
        <a><cite>Vinícius Cabral</cite></a>
      </Link>.
    </p>
    <p>
      Conheça também a autora da{" "}
      <Link href="https://unsplash.com/photos/oo1COphDN8w">
        <a>imagem</a>
      </Link>,{" "}
      <Link href="https://unsplash.com/@ahungryblonde_">
        <a><cite>Sara Dubler</cite></a>
      </Link>.
    </p>
  </footer>
}
