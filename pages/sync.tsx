import { db } from "../lib/db";
import { Button, Table } from "react-bootstrap";
import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs'
import { Account } from "../lib/account";
import { SupportedBlockchain, SupportedPlatform } from "@qbalin/new_crypto_accountant_utils";
import syncEtherscanLikeData from "../lib/etherscan_like/sync";
import syncKucoinData from "../lib/kucoin/sync";

const Sync = () => {
  const accounts = useLiveQuery(
    () => db.accounts.toArray()
  );
  const normalTransactions = useLiveQuery(
    () => db.etherscanLikeNormalTransactions.toArray()
  );
  const lastKucoinLedgerEntries = useLiveQuery(
    () => db.kucoinLedgerEntries.orderBy('createdAt').last()
  );

  const syncAccounts = async () => {
    if (accounts) {
      for (let i = 0; i < accounts.length; i += 1) {
        const account = accounts[i] as Account;

        if (account.platformName === SupportedPlatform.KuCoin) {
          syncKucoinData(account)
        }
        if (account.blockchainName === SupportedBlockchain.Ethereum) {
          syncEtherscanLikeData(account);
        }
      }
    }
  };

  const displayAccounts = () => {
    if (normalTransactions) {
      return <Table striped bordered>
        <tbody>
          {
            normalTransactions.map(t =>
              <tr key={t.hash}>
                {Object.values(t).map(v => <td key={v as string}>{v}</td>)}
              </tr>
            )
          }
        </tbody>
      </Table>
    }
    return null;
  }

  return <>
    <Button variant="dark" onClick={syncAccounts}>Sync accounts</Button>
    {/* {displayAccounts()} */}
  </>
}

export default Sync;