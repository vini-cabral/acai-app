import { IData } from "../types"

function handlerResponseParse(res: Response) {
  if(res.ok) {
    return res.json()
  } else {
    throw new Error(res.statusText)
  }
}

async function apiClientGetData(): Promise<IData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/menuChoices`)
  return handlerResponseParse(res)
}

export { apiClientGetData }
