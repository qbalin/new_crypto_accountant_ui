import { Account } from '../account';
import { SupportedBlockchain, SupportedPlatform } from '@qbalin/new_crypto_accountant_utils';
import PolygonscanRawData from '../polygonscan/components/raw_data_tables';
import KucoinRawData from '../kucoin/components/raw_data_tables';
import EtherscanRawData from '../etherscan/components/raw_data_tables';

const RawDataTables = ({ account } : {account: Account}) => {
  if (!account) {
    return null;
  } else if (account.platformName === SupportedPlatform.KuCoin) {
    return <KucoinRawData accountId={account.id}/>;
  } else if (account.blockchainName === SupportedBlockchain.Ethereum) {
    return <EtherscanRawData accountId={account.id}/>;
  } else if (account.blockchainName === SupportedBlockchain.Polygon) {
    return <PolygonscanRawData accountId={account.id}/>;
  }

  return null;
}

export default RawDataTables;