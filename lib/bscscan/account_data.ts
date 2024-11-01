import { SupportedBlockchain } from "@qbalin/new_crypto_accountant_utils";
import { Account } from "../account";
import { db } from "../db";

const purgeAccountData = async (accountId) => db.transaction('rw', db.etherscanLikeNormalTransactions, db.etherscanLikeInternalTransactions, db.etherscanLikeTokenTransactions, async () => {
  await db.etherscanLikeInternalTransactions.where({ uiAccountId: accountId }).delete();
  await db.etherscanLikeNormalTransactions.where({ uiAccountId: accountId }).delete();
  await db.etherscanLikeTokenTransactions.where({ uiAccountId: accountId }).delete();
})

const syncData = async (account: Account) => {
  const results = await fetch(`/api/raw_data/${SupportedBlockchain.BinanceSmartChain}?apiKey=${encodeURIComponent(account.blockchainExplorerApiKey)}&walletAddress=${encodeURIComponent(account.walletAddress)}`).then(res => res.json());
  return db.transaction('rw', db.etherscanLikeInternalTransactions, db.etherscanLikeNormalTransactions, db.etherscanLikeTokenTransactions, async ()=>{
    // Records from etherscan have no id, so to perform an update
    // - We fetch them all (the API is quite fast)
    // - We destroy the previous ones
    // - We save all that the API returned
    await purgeAccountData(account.id);

    db.etherscanLikeNormalTransactions.bulkAdd(results.normalTransactions.map(t => ({...t, uiAccountId: account.id })));
    db.etherscanLikeInternalTransactions.bulkAdd(results.internalTransactions.map(t => ({...t, uiAccountId: account.id })));
    db.etherscanLikeTokenTransactions.bulkAdd(results.tokenTransactions.map(t => ({...t, uiAccountId: account.id })));
  })
}

const deleteAccount = async (accountId) => db.transaction('rw', db.accounts, db.etherscanLikeNormalTransactions, db.etherscanLikeInternalTransactions, db.etherscanLikeTokenTransactions, async () => {
  await db.accounts.delete(accountId);
  await db.etherscanLikeInternalTransactions.where({ uiAccountId: accountId }).delete();
  await db.etherscanLikeNormalTransactions.where({ uiAccountId: accountId }).delete();
  await db.etherscanLikeTokenTransactions.where({ uiAccountId: accountId }).delete();
})

const rawDataBundle = async (accountId) => {
  const internalTransactions = await db.etherscanLikeInternalTransactions.where({ uiAccountId: accountId }).toArray();
  const normalTransactions = await db.etherscanLikeNormalTransactions.where({ uiAccountId: accountId }).toArray();
  const tokenTransactions = await db.etherscanLikeTokenTransactions.where({ uiAccountId: accountId }).toArray();
  return {
    type: SupportedBlockchain.BinanceSmartChain,
    normalTransactions,
    internalTransactions,
    tokenTransactions
  }
}

export { deleteAccount, syncData, purgeAccountData, rawDataBundle };
