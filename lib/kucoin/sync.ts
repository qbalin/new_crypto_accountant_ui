import { Account } from "../account";
import { db } from "../db";

const syncKucoinData = async (account: Account, since?: Date) => {
  const lastCreatedAt = (await db.kucoinLedgerEntries.orderBy('createdAt').last())?.createdAt;
  const beginningOfLastYear = new Date((new Date().getFullYear() - 1).toString());
  // Adding one millisecond to avoid fetching results we already have
  const fetchFrom = (since || lastCreatedAt || beginningOfLastYear).valueOf() + 1;

  console.log('lastCreatedAt', lastCreatedAt);
  console.log('fetchFrom', fetchFrom);
  const results = await fetch(`/api/kucoin_data?privateApiKey=${account.privateApiKey}&privateApiPassphrase=${account.privateApiPassphrase}&privateApiSecret=${account.privateApiSecret}&since=${fetchFrom}`).then(res => res.json());
  const ledgerEntriesWithAccountId = results.ledgers.map(l => ({ ...l, uiAccountId: account.id }));

  return db.kucoinLedgerEntries.bulkAdd(ledgerEntriesWithAccountId).catch(error => {
    // Swallow duplicate entry error. BulkAdd won't rollback the succesful entries.
    if (!error.message.match(/Key already exists in the object store/)) {
      throw error;
    }
  });
}

export default syncKucoinData;
