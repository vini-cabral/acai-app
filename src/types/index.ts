export interface IItem {
  id: string,
  name: string,
  desc: string,
  price: number,
  checked: boolean
}

export interface IItemMax {
  max: number
  items: IItem[]
}

export interface IData {
  sizes: IItem[]
  plus: IItemMax
}
