import { NextApiRequest, NextApiResponse } from 'next'
import { EtherscanClient, SupportedBlockchain } from '@qbalin/new_crypto_accountant_utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const etherscanLikeApiKey = req.query.apiKey as string;
  const walletAddress = req.query.walletAddress as string;
  const since = new Date('2021');

  const client = new EtherscanClient({ etherscanLikeApiKey: req.query.apiKey as string });
  const normalTransactions = await client.normalTransactions({ walletAddress, since });
  const internalTransactions = await client.internalTransactions({ walletAddress, since });
  const tokenTransactions = await client.tokenTransactions({ walletAddress, since });

  res.status(200).json({
    normalTransactions,
    internalTransactions,
    tokenTransactions
  })
}