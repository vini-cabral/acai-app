import React from "react"
// My Project
import { IItem, IItemMax} from "../types"

export interface IDataContext {
  sizes: IItem[] | null
  setSizes: Function
  plus: IItemMax | null
  setPlus: Function
}

const dataContext = React.createContext<IDataContext>({
  sizes: null,
  setSizes: () => {},
  plus: null,
  setPlus: () => {},
})

export default dataContext
