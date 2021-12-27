import { Account } from "../account";
import { db } from "../db";

const syncEtherscanLikeData = async (account: Account) => {
  const results = await fetch(`/api/etherscan_data?apiKey=${account.blockchainExplorerApiKey}&walletAddress=${account.walletAddress}`).then(res => res.json());
  return db.transaction('rw', db.etherscanLikeInternalTransactions, db.etherscanLikeNormalTransactions, db.etherscanLikeTokenTransactions, async ()=>{
    // Records from etherscan have no id, so to perform an update
    // - We fetch them all (the API is quite fast)
    // - We destroy the previous ones
    // - We save all that the API returned
    db.etherscanLikeNormalTransactions.clear();
    db.etherscanLikeInternalTransactions.clear();
    db.etherscanLikeTokenTransactions.clear();

    db.etherscanLikeNormalTransactions.bulkAdd(results.normalTransactions.map(t => ({...t, uiAccountId: account.id })));
    db.etherscanLikeInternalTransactions.bulkAdd(results.internalTransactions.map(t => ({...t, uiAccountId: account.id })));
    db.etherscanLikeTokenTransactions.bulkAdd(results.tokenTransactions.map(t => ({...t, uiAccountId: account.id })));
  })
}

export default syncEtherscanLikeData;
