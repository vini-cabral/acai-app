import styles from "./Error.module.css"

type Props = {
  children: JSX.Element | JSX.Element[]
}

export default function Error({ children }:Props) {
  return <div className={ styles['error'] }>
    { children }
  </div>
}
