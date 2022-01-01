import { SupportedBlockchain, SupportedPlatform } from "@qbalin/new_crypto_accountant_utils";
import { Account } from "./account";
import { db } from "./db";

import * as Ethereum from "./etherscan/account_data";
import * as Polygon from "./polygonscan/account_data";
import * as Kucoin from "./kucoin/account_data";
import * as BinanceSmartChain from "./bscscan/account_data";
import * as Coinbase from "./coinbase/account_data";

const moduleFor = (account: Account) => {
  if (account.platformName === SupportedPlatform.KuCoin) {
    return Kucoin;
  }
  if (account.platformName === SupportedPlatform.Coinbase) {
    return Coinbase;
  }
  if (account.blockchainName === SupportedBlockchain.Ethereum) {
    return Ethereum;
  }
  if (account.blockchainName === SupportedBlockchain.Polygon) {
    return Polygon;
  }
  if (account.blockchainName === SupportedBlockchain.BinanceSmartChain) {
    return BinanceSmartChain;
  }
    throw new Error(`syncAccount unimplemented for ${account.blockchainName || account.platformName}`);

}

export async function syncAccount(account: Account) {
  return moduleFor(account).syncData(account);
}

export async function deleteAccount(accountId) {
  const account = await db.accounts.get(accountId);
  return moduleFor(account).deleteAccount(accountId);
}

export async function purgeAccountData(accountId) {
  const account = await db.accounts.get(accountId);
  return moduleFor(account).purgeAccountData(accountId);
}

export async function rawDataBundle() {
  return Promise.all((await db.accounts.toArray()).map((account: Account) =>
    moduleFor(account).rawDataBundle(account.id)
  ));
}