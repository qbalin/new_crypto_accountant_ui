import { NextApiRequest, NextApiResponse } from 'next'
import { EtherscanClient, SupportedBlockchain, SupportedPlatform } from '@qbalin/new_crypto_accountant_utils';

import kucoinRawDataHandler from '../kucoin/api/raw_data';
import etherscanRawDataHandler from '../etherscan/api/raw_data';

export default async function rawDataHandler(req: NextApiRequest, res: NextApiResponse) {
  const { source } = req.query;
  if (source === SupportedPlatform.KuCoin ) {
    return kucoinRawDataHandler(req, res);
  } else if (source === SupportedBlockchain.Ethereum) {
    return etherscanRawDataHandler(req, res);
  } else {
    throw new Error(`Data source not implemented: ${source}`);
  }
}