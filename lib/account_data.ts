import { SupportedBlockchain, SupportedPlatform } from "@qbalin/new_crypto_accountant_utils";
import { Account } from "./account";
import { db } from "./db";

import { syncEthereumData, deleteEthereumAccount, purgeEthereumAccountData } from "./etherscan/account_data";
import { syncPolygonData, deletePolygonAccount, purgePolygonAccountData } from "./polygonscan/account_data";
import { syncKucoinData, deleteKucoinAccount, purgeKucoinAccountData } from "./kucoin/account_data";
import { syncBscData, deleteBscAccount, purgeBscAccountData } from "./bscscan/account_data";

export async function syncAccount(account: Account) {
  if (account.platformName === SupportedPlatform.KuCoin) {
    syncKucoinData(account);
  } else if (account.blockchainName === SupportedBlockchain.Ethereum) {
    syncEthereumData(account);
  } else if (account.blockchainName === SupportedBlockchain.Polygon) {
    syncPolygonData(account);
  } else if (account.blockchainName === SupportedBlockchain.BinanceSmartChain) {
    syncBscData(account);
  } else {
    throw new Error(`syncAccount unimplemented for ${account.blockchainName || account.platformName}`);
  }
}

export async function deleteAccount(accountId) {
  const account = await db.accounts.get(accountId);
  if (account.platformName === SupportedPlatform.KuCoin) {
    return deleteKucoinAccount(accountId);
  } else if (account.blockchainName === SupportedBlockchain.Ethereum) {
    return deleteEthereumAccount(accountId);
  } else if (account.blockchainName === SupportedBlockchain.Polygon) {
    return deletePolygonAccount(accountId);
  } else if (account.blockchainName === SupportedBlockchain.BinanceSmartChain) {
    return deleteBscAccount(accountId);
  } else {
    throw new Error(`deleteAccount unimplemented for ${account.blockchainName || account.platformName}`);
  }
}

export async function purgeAccountData(accountId) {
  const account = await db.accounts.get(accountId);
  if (account.platformName === SupportedPlatform.KuCoin) {
    purgeKucoinAccountData(accountId);
  } else if (account.blockchainName === SupportedBlockchain.Ethereum) {
    purgeEthereumAccountData(accountId);
  } else if (account.blockchainName === SupportedBlockchain.Polygon) {
    purgePolygonAccountData(accountId);
  } else if (account.blockchainName === SupportedBlockchain.BinanceSmartChain) {
    purgeBscAccountData(accountId);
  } else {
    throw new Error(`deleteAccount unimplemented for ${account.blockchainName || account.platformName}`);
  }
}