import { db } from "../lib/db";
import { Button } from "react-bootstrap";
import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs'
import { Account } from "../lib/account";
import { syncAccount } from "../lib/account_data";

const Sync = () => {
  const accounts = useLiveQuery(
    () => db.accounts.toArray()
  );

  const syncAccounts = async () => {
    if (accounts) {
      for (let i = 0; i < accounts.length; i += 1) {
        const account = accounts[i] as Account;
        syncAccount(account);
      }
    }
  };

  return <>
    <Button variant="dark" onClick={syncAccounts}>Sync accounts</Button>
  </>
}

export default Sync;