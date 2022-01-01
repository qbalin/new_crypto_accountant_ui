import { SupportedBlockchain, SupportedPlatform } from '@qbalin/new_crypto_accountant_utils';
import { Account } from '../account';
import PolygonscanRawData from '../polygonscan/components/raw_data_tables';
import KucoinRawData from '../kucoin/components/raw_data_tables';
import EtherscanRawData from '../etherscan/components/raw_data_tables';
import BscscanRawData from '../bscscan/components/raw_data_tables';
import CoinbaseRawData from '../coinbase/components/raw_data_tables';

const RawDataTables = ({ account } : {account: Account}) => {
  if (!account) {
    return null;
  }
  if (account.platformName === SupportedPlatform.KuCoin) {
    return <KucoinRawData accountId={account.id}/>;
  }
  if (account.platformName === SupportedPlatform.Coinbase) {
    return <CoinbaseRawData accountId={account.id}/>;
  }
  if (account.blockchainName === SupportedBlockchain.Ethereum) {
    return <EtherscanRawData accountId={account.id}/>;
  }
  if (account.blockchainName === SupportedBlockchain.Polygon) {
    return <PolygonscanRawData accountId={account.id}/>;
  }
  if (account.blockchainName === SupportedBlockchain.BinanceSmartChain) {
    return <BscscanRawData accountId={account.id}/>;
  }

  return null;
}

export default RawDataTables;