import { NextApiRequest, NextApiResponse } from 'next'
import { BscscanClient } from '@qbalin/new_crypto_accountant_utils';

export default async function bscscanRawDataHandler(req: NextApiRequest, res: NextApiResponse) {
  const etherscanLikeApiKey = req.query.apiKey as string;
  const walletAddress = req.query.walletAddress as string;

  const client = new BscscanClient({ etherscanLikeApiKey });
  const normalTransactions = await client.normalTransactions({ walletAddress });
  const internalTransactions = await client.internalTransactions({ walletAddress });
  const tokenTransactions = await client.tokenTransactions({ walletAddress });

  res.status(200).json({
    normalTransactions,
    internalTransactions,
    tokenTransactions
  })
}