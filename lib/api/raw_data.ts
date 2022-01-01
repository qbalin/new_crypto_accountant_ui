import { NextApiRequest, NextApiResponse } from 'next'
import { SupportedBlockchain, SupportedPlatform } from '@qbalin/new_crypto_accountant_utils';

import kucoinRawDataHandler from '../kucoin/api/raw_data';
import etherscanRawDataHandler from '../etherscan/api/raw_data';
import polygonscanRawDataHandler from '../polygonscan/api/raw_data';
import bscscanRawDataHandler from '../bscscan/api/raw_data';
import coinbaseRawDataHandler from '../coinbase/api/raw_data';

export default async function rawDataHandler(req: NextApiRequest, res: NextApiResponse) {
  const { source } = req.query;
  if (source === SupportedPlatform.KuCoin ) {
    return kucoinRawDataHandler(req, res);
  }
  if (source === SupportedPlatform.Coinbase) {
    return coinbaseRawDataHandler(req, res);
  }
  if (source === SupportedBlockchain.Ethereum) {
    return etherscanRawDataHandler(req, res);
  }
  if (source === SupportedBlockchain.Polygon) {
    return polygonscanRawDataHandler(req, res);
  }
  if (source === SupportedBlockchain.BinanceSmartChain) {
    return bscscanRawDataHandler(req, res);
  }
  throw new Error(`Data source not implemented: ${source}`);
}