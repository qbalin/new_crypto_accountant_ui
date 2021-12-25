// db.ts
import Dexie, { Table } from 'dexie';
import 'fake-indexeddb/auto';

export enum SupportedPlatforms {
  Coinbase = 'Coinbase'
}

export interface CentralizedAccount {
  id?: number;
  platformName: SupportedPlatforms,
  privateApiKey: string,
  privateApiPassphrase?: string,
  privateApiSecret?: string,
  nickname: string
}

export class SubClassedDexie extends Dexie {
  centralizedAccounts!: Table<CentralizedAccount>;

  constructor() {
    super('database');
    this.version(1).stores({
      centralizedAccounts: '++id, platformName, &nickname, &[platformName+privateApiKey+privateApiPassphrase+privateApiSecret]' // Primary key and indexed props
    });
  }
}

export const db = new SubClassedDexie();