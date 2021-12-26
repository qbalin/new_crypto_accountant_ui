import { db } from "../lib/db";
import { Button, Table } from "react-bootstrap";
import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Image from "next/image";
import { useState } from "react";
import { Account } from "../lib/account";
import { SupportedBlockchain, SupportedPlatform } from "@qbalin/new_crypto_accountant_utils";

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

        // if (account.platformName === SupportedPlatform.KuCoin) {
        //   const results = await fetch('/api/kucoin_data').then(res => res.json());
        //   db.kucoinLedgerEntries.bulkAdd(results.ledgers.map(r => ({...r, uiAccountId: account.id})));
        // }
        if (account.blockchainName === SupportedBlockchain.Ethereum) {
          const results = await fetch(`/api/etherscan_data?apiKey=${account.blockchainExplorerApiKey}&walletAddress=${account.walletAddress}`).then(res => res.json());
          db.etherscanLikeNormalTransactions.bulkAdd(results.normalTransactions.map(t => ({...t, uiAccountId: account.id })));
          debugger;
          db.etherscanLikeInternalTransactions.bulkAdd(results.internalTransactions.map(t => ({...t, uiAccountId: account.id })));
          db.etherscanLikeTokenTransactions.bulkAdd(results.tokenTransactions.map(t => ({...t, uiAccountId: account.id })));
        }
      }
    }
  };

  const displayAccounts = () => {
    if (normalTransactions) {
      return <Table striped bordered>
        {
          normalTransactions.map(t =>
            <tr key={t.hash}>
              {Object.values(t).map(v => <td key={v as string}>{v}</td>)}
            </tr>
          )
        }
      </Table>
    }
    return null;
  }

  return <>
    <Button variant="dark" onClick={syncAccounts}>Sync accounts</Button>
    {displayAccounts()}
  </>
}

export default Sync;