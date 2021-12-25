// db.ts
import Dexie, { Table } from 'dexie';
import 'fake-indexeddb/auto';

export enum SupportedPlatforms {
  Coinbase = 'Coinbase'
}
export enum SupportedBlockchains {
  Ethereum = 'Ethereum'
}

export interface Account {
  id?: number;
  platformName?: SupportedPlatforms,
  privateApiKey?: string,
  privateApiPassphrase?: string,
  privateApiSecret?: string,
  nickname: string,
  walletAddress?: string,
  blockchainName?: SupportedBlockchains,
  blockchainExplorerApiKey?: string,
}

export class SubClassedDexie extends Dexie {
  accounts!: Table<Account>;

  constructor() {
    super('database');
    this.version(1).stores({
      accounts: '++id, &nickname, &[platformName+privateApiKey+privateApiPassphrase+privateApiSecret], &[walletAddress+blockchainName+blockchainExplorerApiKey]'
    });
  }
}

export const db = new SubClassedDexie();