import styles from "./DisplayPart.module.css"

type Props = {
  children?: JSX.Element | JSX.Element[]
}

export default function DisplayPart({ children }: Props) {
  return <section className={ styles['display'] }>
    { children }
  </section>
}
