import { SupportedPlatform } from '@qbalin/new_crypto_accountant_utils';
import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs'
import { db } from "../../lib/db";
import KucoinRawData from './kucoin';

const RawData = ({ accountId }) => {
  const account = useLiveQuery(
    () => accountId && db.accounts.get(parseInt(accountId, 10)), [accountId]
  );

  if (!account) {
    return null;
  }

  if (account.platformName === SupportedPlatform.KuCoin) {
    return <KucoinRawData accountId={account.id}/>;
  }

  return null;
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