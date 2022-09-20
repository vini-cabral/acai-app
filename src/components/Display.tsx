import styles from "./Display.module.css"

type Props = {
  children?: JSX.Element | JSX.Element[]
}

export default function Display({ children }: Props) {
  return <section className={ styles['display'] }>
    { children }
  </section>
}
