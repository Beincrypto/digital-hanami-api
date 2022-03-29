import { VercelRequest, VercelResponse } from '@vercel/node'

export const time = async (): Promise<{
  time?: number
}> => {
  return {
    time: new Date().getTime(),
  }
}

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const data = await time()
  res.status(200).send(data).end()
}
