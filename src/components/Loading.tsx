import { ClipLoader } from "react-spinners"
// My Project
import styles from "./Loading.module.css"

const Loading = () => <div className={ styles['loading'] }>
  <ClipLoader color="orange"/>
</div>

export default Loading
