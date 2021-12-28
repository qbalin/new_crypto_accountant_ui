import { SupportedBlockchain, SupportedPlatform } from "@qbalin/new_crypto_accountant_utils";
import { Account } from "./account";
import { db } from "./db";

import { syncEtherscanLikeData, deleteEtherscanLikeAccount, purgeEtherscanLikeAccountData } from "./etherscan/account_data";
import { syncKucoinData, deleteKucoinAccount, purgeKucoinAccountData } from "./kucoin/account_data";

export async function syncAccount(account: Account) {
  if (account.platformName === SupportedPlatform.KuCoin) {
    syncKucoinData(account);
  } else if (account.blockchainName === SupportedBlockchain.Ethereum) {
    syncEtherscanLikeData(account);
  } else {
    throw new Error(`syncAccount unimplemented for ${account.blockchainName || account.platformName}`);
  }
}

export async function deleteAccount(accountId) {
  const account = await db.accounts.get(accountId);
  if (account.platformName === SupportedPlatform.KuCoin) {
    return deleteKucoinAccount(accountId);
  } else if (account.blockchainName === SupportedBlockchain.Ethereum) {
    return deleteEtherscanLikeAccount(accountId);
  } else {
    throw new Error(`deleteAccount unimplemented for ${account.blockchainName || account.platformName}`);
  }
}

export async function purgeAccountData(accountId) {
  const account = await db.accounts.get(accountId);
  if (account.platformName === SupportedPlatform.KuCoin) {
    purgeKucoinAccountData(accountId);
  } else if (account.blockchainName === SupportedBlockchain.Ethereum) {
    purgeEtherscanLikeAccountData(accountId);
  } else {
    throw new Error(`deleteAccount unimplemented for ${account.blockchainName || account.platformName}`);
  }
}