import { NextApiRequest, NextApiResponse } from 'next'
import { PolygonscanClient } from '@qbalin/new_crypto_accountant_utils';

export default async function polygonscanRawDataHandler(req: NextApiRequest, res: NextApiResponse) {
  const etherscanLikeApiKey = req.query.apiKey as string;
  const walletAddress = req.query.walletAddress as string;

  const client = new PolygonscanClient({ etherscanLikeApiKey });

  const normalTransactions = await client.normalTransactions({ walletAddress });
  const internalTransactions = await client.internalTransactions({ walletAddress });
  const tokenTransactions = await client.tokenTransactions({ walletAddress });
  console.log('-----------')
  console.log('-----------')
  console.log('-----------')
  console.log(normalTransactions.length)

  res.status(200).json({
    normalTransactions,
    internalTransactions,
    tokenTransactions
  })
}