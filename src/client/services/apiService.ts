import { IData } from "../../types"
import { API_CLIENT } from "../env"

function handleResponseParse(res: Response) {
  if(res.ok) {
    return res.json()
  } else {
    throw new Error(res.statusText)
  }
}

async function apiClientGetData(): Promise<IData> {
  const res = await fetch(`${API_CLIENT.baseURL}/menuChoices`)
  return handleResponseParse(res)
}

export { apiClientGetData }
