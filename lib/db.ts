// db.ts
import Dexie, { Table } from 'dexie';
import 'fake-indexeddb/auto';
import { Account, accountIndices } from './account';
import { KucoinLedgerEntry, kucoinLedgerEntryIndices } from './kucoin/models/ledger_entry';
import { EtherscanLikeNormalTransaction, etherscanLikeNormalTransactionIndices } from './etherscan/models/normal_transaction';
import { EtherscanLikeInternalTransaction, etherscanLikeInternalTransactionIndices } from './etherscan/models/internal_transaction';
import { EtherscanLikeTokenTransaction, etherscanLikeTokenTransactionIndices } from './etherscan/models/token_transaction';
import { CoinbaseAccount, coinbaseAccountIndices } from './coinbase/models/account';
import { CoinbaseFill, coinbaseFillIndices } from './coinbase/models/fill';
import { CoinbaseTransfer, coinbaseTransferIndices } from './coinbase/models/transfer';
import { CoinbaseProduct, coinbaseProductIndices } from './coinbase/models/product';
import { CoinbaseConversion, coinbaseConversionIndices } from './coinbase/models/conversion';

export class SubClassedDexie extends Dexie {
  accounts!: Table<Account>;
  kucoinLedgerEntries!: Table<KucoinLedgerEntry>;
  etherscanLikeNormalTransactions!: Table<EtherscanLikeNormalTransaction>;
  etherscanLikeInternalTransactions!: Table<EtherscanLikeInternalTransaction>;
  etherscanLikeTokenTransactions!: Table<EtherscanLikeTokenTransaction>;
  coinbaseAccounts!: Table<CoinbaseAccount>
  coinbaseFills!: Table<CoinbaseFill>
  coinbaseTransfers!: Table<CoinbaseTransfer>
  coinbaseProducts!: Table<CoinbaseProduct>
  coinbaseConversions!: Table<CoinbaseConversion>

  constructor() {
    super('database');
    this.version(6).stores({
      accounts: accountIndices,
      kucoinLedgerEntries: kucoinLedgerEntryIndices,
      etherscanLikeNormalTransactions: etherscanLikeNormalTransactionIndices,
      etherscanLikeInternalTransactions: etherscanLikeInternalTransactionIndices,
      etherscanLikeTokenTransactions: etherscanLikeTokenTransactionIndices,
      coinbaseAccounts: coinbaseAccountIndices,
      coinbaseFills: coinbaseFillIndices,
      coinbaseTransfers: coinbaseTransferIndices,
      coinbaseProducts: coinbaseProductIndices,
      coinbaseConversions: coinbaseConversionIndices,
    });
  }
}

export const db = new SubClassedDexie();