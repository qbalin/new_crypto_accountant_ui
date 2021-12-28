import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs'
import { useState } from 'react';
import { db } from "../../lib/db";

const RawData = ({ accountId }) => {
  const account = useLiveQuery(
    () => accountId && db.accounts.get(parseInt(accountId, 10)), [accountId]
  );


  return JSON.stringify(account || '');
}

const getAllAccountIds = async () => {
  return (await db.accounts.toArray()).map(account => ({
    params: {
      accountId: account.id
    }
  }));
}

export async function getStaticPaths() {
  const paths = await getAllAccountIds();
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }) {


  return {
    props: {
      accountId: params.accountId
    }
  }
}

export default RawData;