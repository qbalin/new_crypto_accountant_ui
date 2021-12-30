import { SupportedPlatform } from "@qbalin/new_crypto_accountant_utils";
import { Account } from "../account";
import { db } from "../db";

const syncData = async (account: Account, since?: Date) => {
  const lastTransferCreatedAt = (await (await db.coinbaseTransfers.toArray()).sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)))[0]?.created_at;
  const lastFillCreatedAt = (await (await db.coinbaseFills.toArray()).sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)))[0]?.created_at;
  const lastCreatedAt = (!lastTransferCreatedAt && !lastFillCreatedAt) ? null : new Date(Math.max(+new Date(lastTransferCreatedAt || 0), +new Date(lastFillCreatedAt || 0)));

  const beginningOfLastYear = new Date((new Date().getFullYear() - 1).toString());
  // Adding one millisecond to avoid fetching results we already have
  const fetchFrom = (since || lastCreatedAt || beginningOfLastYear).valueOf() + 1;
  const results = await fetch(`/api/raw_data/${SupportedPlatform.Coinbase}?privateApiKey=${encodeURIComponent(account.privateApiKey)}&privateApiPassphrase=${encodeURIComponent(account.privateApiPassphrase)}&privateApiSecret=${encodeURIComponent(account.privateApiSecret)}&since=${fetchFrom}`).then(res => res.json());

  const accountsWithAccountId = results.accounts.map(record => ({ ...record, uiAccountId: account.id }));
  const conversionsWithAccountId = results.conversions.map(record => ({ ...record, uiAccountId: account.id }));
  const productsWithAccountId = results.products.map(record => ({ ...record, uiAccountId: account.id }));
  const transfersWithAccountId = results.transfers.map(record => ({ ...record, uiAccountId: account.id }));

  await db.coinbaseAccounts.bulkAdd(accountsWithAccountId).catch(error => {
    // Swallow duplicate entry error. BulkAdd won't rollback the succesful entries.
    if (!error.message.match(/Key already exists in the object store/)) {
      throw error;
    }
  });
  await db.coinbaseConversions.bulkAdd(conversionsWithAccountId).catch(error => {
    // Swallow duplicate entry error. BulkAdd won't rollback the succesful entries.
    if (!error.message.match(/Key already exists in the object store/)) {
      throw error;
    }
  });
  await db.coinbaseProducts.bulkAdd(productsWithAccountId).catch(error => {
    // Swallow duplicate entry error. BulkAdd won't rollback the succesful entries.
    if (!error.message.match(/Key already exists in the object store/)) {
      throw error;
    }
  });
  await db.coinbaseTransfers.bulkAdd(transfersWithAccountId).catch(error => {
    // Swallow duplicate entry error. BulkAdd won't rollback the succesful entries.
    if (!error.message.match(/Key already exists in the object store/)) {
      throw error;
    }
  });

  // Fills are super slow: they must be fetched by product id. We'll fetch the products
  // that the user has used first, and then all other
  const usedProductIds = (await db.coinbaseFills.toArray()).map(fill => fill.product_id);
  const allProductIds = (await db.coinbaseProducts.toCollection().primaryKeys());
  const productIds = Array.from(new Set([...usedProductIds, ...allProductIds])) as string[];
  for (let i = 0; i < productIds.length; i += 1) {
    const productId = productIds[i];
    const res = await fetch(`/api/raw_data/${SupportedPlatform.Coinbase}?privateApiKey=${encodeURIComponent(account.privateApiKey)}&privateApiPassphrase=${encodeURIComponent(account.privateApiPassphrase)}&privateApiSecret=${encodeURIComponent(account.privateApiSecret)}&since=${fetchFrom}&productId=${encodeURIComponent(productId)}`).then(res => res.json());
    const fillsWithAccountId = res.fills.map(record => ({ ...record, uiAccountId: account.id }));
    await db.coinbaseFills.bulkAdd(fillsWithAccountId).catch(error => {
      // Swallow duplicate entry error. BulkAdd won't rollback the succesful entries.
      if (!error.message.match(/Key already exists in the object store/)) {
        throw error;
      }
    });
  }
}

const deleteAccount = async (accountId) => {
  return db.transaction('rw', [db.accounts, db.coinbaseAccounts, db.coinbaseProducts, db.coinbaseConversions, db.coinbaseProducts, db.coinbaseFills, db.coinbaseTransfers], async () => {
    await db.accounts.delete(accountId);
    await db.coinbaseAccounts.where({ uiAccountId: accountId }).delete();
    await db.coinbaseProducts.where({ uiAccountId: accountId }).delete();
    await db.coinbaseConversions.where({ uiAccountId: accountId }).delete();
    await db.coinbaseFills.where({ uiAccountId: accountId }).delete();
    await db.coinbaseTransfers.where({ uiAccountId: accountId }).delete();
  });
}

const purgeAccountData = async (accountId) => {
  return db.transaction('rw', [db.coinbaseAccounts, db.coinbaseProducts, db.coinbaseConversions, db.coinbaseProducts, db.coinbaseFills, db.coinbaseTransfers], async () => {
    await db.coinbaseAccounts.where({ uiAccountId: accountId }).delete();
    await db.coinbaseProducts.where({ uiAccountId: accountId }).delete();
    await db.coinbaseConversions.where({ uiAccountId: accountId }).delete();
    await db.coinbaseFills.where({ uiAccountId: accountId }).delete();
    await db.coinbaseTransfers.where({ uiAccountId: accountId }).delete();
  });
}

const rawDataBundle = async (accountId) => {
  const accounts = await db.coinbaseAccounts.where({ uiAccountId: accountId }).toArray();
  const products = await db.coinbaseProducts.where({ uiAccountId: accountId }).toArray();
  const conversions = await db.coinbaseConversions.where({ uiAccountId: accountId }).toArray();
  const fills = await db.coinbaseFills.where({ uiAccountId: accountId }).toArray();
  const transfers = await db.coinbaseTransfers.where({ uiAccountId: accountId }).toArray();
  return {
    type: SupportedPlatform.Coinbase,
    accounts,
    products,
    conversions,
    fills,
    transfers
  }
}

export { syncData, deleteAccount, purgeAccountData, rawDataBundle };
