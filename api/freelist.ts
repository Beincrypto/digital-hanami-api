import { VercelRequest, VercelResponse } from '@vercel/node'
import { MerkleTree } from 'merkletreejs'
import { utils } from 'ethers'
import mainLeaf from '../src/config/freelist/mainnet.json'
import testLeaf from '../src/config/freelist/testnet.json'

export const freelistMerkleRoot = async (
  chainId: string,
): Promise<{
  status: number
  root?: string
}> => {
  let merkleTree
  if (chainId === '1') {
    // mainnet
    merkleTree = new MerkleTree(mainLeaf, utils.keccak256, { sortPairs: true })
  } else {
    // testnet
    merkleTree = new MerkleTree(testLeaf, utils.keccak256, { sortPairs: true })
  }
  const root = merkleTree.getHexRoot()

  return {
    status: 200,
    root,
  }
}

export const freelist = async (
  chainId: string,
  address: string,
): Promise<{
  status: number
  listed?: boolean
  proof?: string[]
}> => {
  let proof: string[] = []
  let merkleTree
  if (chainId === '1') {
    // mainnet
    merkleTree = new MerkleTree(mainLeaf, utils.keccak256, { sortPairs: true })
  } else {
    // testnet
    merkleTree = new MerkleTree(testLeaf, utils.keccak256, { sortPairs: true })
  }
  const claimingAddressHash = utils.keccak256(address)
  proof = merkleTree.getHexProof(claimingAddressHash)

  return {
    status: 200,
    listed: proof.length > 0,
    proof,
  }
}

export default async (req: VercelRequest, res: VercelResponse): Promise<void | VercelResponse> => {
  // Read parameters
  const chainId = req.query['chainId'] as string
  const address = req.query['address'] as string
  // Check all parameters OK
  if (chainId === undefined || address === undefined) {
    // Bad request
    return res.status(400).end()
  }
  let data
  if (address === 'root') {
    // get merkle tree root
    data = await freelistMerkleRoot(chainId)
  } else {
    // get address freelist data
    data = await freelist(chainId, address)
  }
  // Send data and end connection
  res.status(data.status).send(data).end()
}
