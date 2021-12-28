import { NextApiRequest, NextApiResponse } from 'next'
import { EtherscanClient, SupportedBlockchain } from '@qbalin/new_crypto_accountant_utils';
import rawDataHandler from '../../../lib/api/raw_data';

export default rawDataHandler;