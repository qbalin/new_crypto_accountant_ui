import { SupportedPlatform } from "@qbalin/new_crypto_accountant_utils";
import { Account } from "../account";
import { db } from "../db";

const syncData = async (account: Account, since?: Date) => {
  const lastCreatedAt = (await db.kucoinLedgerEntries.orderBy('createdAt').last())?.createdAt;
  const beginningOfLastYear = new Date((new Date().getFullYear() - 1).toString());
  // Adding one millisecond to avoid fetching results we already have
  const fetchFrom = (since || lastCreatedAt || beginningOfLastYear).valueOf() + 1;

  const today = (new Date()).valueOf();
  const oneWeek = 1000 * 3600 * 24 * 7;
  const numberOfWeeksToFetch = Math.ceil((today - fetchFrom) / oneWeek);

  const intervalsToFetch = [];
  for (let i = 0; i < numberOfWeeksToFetch; i += 1) {
    intervalsToFetch.push({
      since: fetchFrom +  i * oneWeek,
      until: fetchFrom + oneWeek + i * oneWeek,
    })
  }

  for (let i = intervalsToFetch.length - 1; i >= 0; i -= 1) {
    const interval = intervalsToFetch[i];
    // eslint-disable-next-line no-await-in-loop
    const results = await fetch(`/api/raw_data/${SupportedPlatform.KuCoin}?privateApiKey=${encodeURIComponent(account.privateApiKey)}&privateApiPassphrase=${encodeURIComponent(account.privateApiPassphrase)}&privateApiSecret=${encodeURIComponent(account.privateApiSecret)}&since=${interval.since}&until=${interval.until}`).then(res => res.json());
    const ledgerEntriesWithAccountId = results.ledgers.map(l => ({ ...l, uiAccountId: account.id }));

    // eslint-disable-next-line no-await-in-loop
    await db.kucoinLedgerEntries.bulkAdd(ledgerEntriesWithAccountId).catch(error => {
      // Swallow duplicate entry error. BulkAdd won't rollback the succesful entries.
      if (!error.message.match(/Key already exists in the object store/)) {
        throw error;
      }
    });
  }
}

const deleteAccount = async (accountId) => db.transaction('rw', db.accounts, db.kucoinLedgerEntries, async () => {
    await db.accounts.delete(accountId);
    await db.kucoinLedgerEntries.where({ uiAccountId: accountId }).delete();
  })

const purgeAccountData = async (accountId) => db.transaction('rw', db.kucoinLedgerEntries, async () => {
    await db.kucoinLedgerEntries.where({ uiAccountId: accountId }).delete();
  })

const rawDataBundle = async (accountId) => {
  const ledgerEntries = await db.kucoinLedgerEntries.where({ uiAccountId: accountId }).toArray();
  return {
    type: SupportedPlatform.KuCoin,
    ledgerEntries,
  }
}

export { syncData, deleteAccount, purgeAccountData, rawDataBundle };
