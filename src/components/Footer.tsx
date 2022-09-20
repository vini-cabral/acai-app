import styles from './Footer.module.css'

export default function Footer() {
  return <footer className={ styles['footer'] }>
    <p>
      Veja o autor do{" "}
      <a target="_blank" href="https://github.com/vini-cabral/acai-app">projeto</a>,{" "}
      <a target="_blank" href="https://github.com/vini-cabral"><cite>Vinícius Cabral</cite></a>.
    </p>
    <p>
      Conheça também a autora da{" "}
      <a target="_blank" href="https://unsplash.com/photos/oo1COphDN8w">imagem</a>,{" "}
      <a target="_blank" href="https://unsplash.com/@ahungryblonde_"><cite>Sara Dubler</cite></a>.
    </p>
  </footer>
}

