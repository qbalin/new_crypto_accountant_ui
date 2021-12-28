import { NextApiRequest, NextApiResponse } from 'next'
import { SupportedBlockchain, SupportedPlatform } from '@qbalin/new_crypto_accountant_utils';

import kucoinRawDataHandler from '../kucoin/api/raw_data';
import etherscanRawDataHandler from '../etherscan/api/raw_data';
import polygonscanRawDataHandler from '../polygonscan/api/raw_data';
import bscscanRawDataHandler from '../bscscan/api/raw_data';

export default async function rawDataHandler(req: NextApiRequest, res: NextApiResponse) {
  const { source } = req.query;
  if (source === SupportedPlatform.KuCoin ) {
    return kucoinRawDataHandler(req, res);
  } else if (source === SupportedBlockchain.Ethereum) {
    return etherscanRawDataHandler(req, res);
  } else if (source === SupportedBlockchain.Polygon) {
    return polygonscanRawDataHandler(req, res);
  } else if (source === SupportedBlockchain.BinanceSmartChain) {
    return bscscanRawDataHandler(req, res);
  } else {
    throw new Error(`Data source not implemented: ${source}`);
  }
}