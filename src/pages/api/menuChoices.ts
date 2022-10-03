// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// My Project
import type { IData } from '../../types'

export default function handlerGetMenuChoices(
  req: NextApiRequest,
  res: NextApiResponse<IData>
) {
  if(req.method === 'GET') {
    res.status(200).json({
      sizes: [
        { id: "size-01", name: "size-00", desc: "Tamanho 300ml", price: 13, checked: false },
        { id: "size-02", name: "size-00", desc: "Tamanho 500ml", price: 16, checked: false },
        { id: "size-03", name: "size-00", desc: "Tamanho 750ml", price: 20, checked: false }
      ],
      plus: {
        max: 3,
        items: [
          { id: "plus-01", name: "plus-05", desc: "Granola", price: 1, checked: false },
          { id: "plus-02", name: "plus-01", desc: "Banana", price: 1.5, checked: false },
          { id: "plus-03", name: "plus-02", desc: "Kiwi", price: 2, checked: false },
          { id: "plus-04", name: "plus-03", desc: "Morango", price: 2, checked: false },
          { id: "plus-05", name: "plus-04", desc: "Castanha de caju", price: 2.5, checked: false }
        ]
      }
    })
  }
}
