// db.ts
import Dexie, { Table } from 'dexie';
import 'fake-indexeddb/auto';
import { Account, accountIndices } from './account';
import { KucoinLedgerEntry, kucoinLedgerEntryIndices } from './kucoin/ledger_entry';
import { EtherscanLikeNormalTransaction, etherscanLikeNormalTransactionIndices } from './etherscan_like/normal_transaction';
import { EtherscanLikeInternalTransaction, etherscanLikeInternalTransactionIndices } from './etherscan_like/internal_transaction';
import { EtherscanLikeTokenTransaction, etherscanLikeTokenTransactionIndices } from './etherscan_like/token_transaction';

export class SubClassedDexie extends Dexie {
  accounts!: Table<Account>;
  kucoinLedgerEntries!: Table<KucoinLedgerEntry>;
  etherscanLikeNormalTransactions!: Table<EtherscanLikeNormalTransaction>;
  etherscanLikeInternalTransactions!: Table<EtherscanLikeInternalTransaction>;
  etherscanLikeTokenTransactions!: Table<EtherscanLikeTokenTransaction>;

  constructor() {
    super('database');
    this.version(4).stores({
      accounts: accountIndices,
      kucoinLedgerEntries: kucoinLedgerEntryIndices,
      etherscanLikeNormalTransactions: etherscanLikeNormalTransactionIndices,
      etherscanLikeInternalTransactions: etherscanLikeInternalTransactionIndices,
      etherscanLikeTokenTransactions: etherscanLikeTokenTransactionIndices,
    });
  }
}

export const db = new SubClassedDexie();