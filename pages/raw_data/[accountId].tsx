import { SupportedBlockchain, SupportedPlatform } from '@qbalin/new_crypto_accountant_utils';
import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs'
import { db } from "../../lib/db";
import KucoinRawData from './kucoin';
import EtherscanLikeRawData from './etherscan_like';
import { Breadcrumb, Modal, Button } from 'react-bootstrap';
import Link from 'next/link';
import { Account } from '../../lib/account';
import { useState } from 'react';
import { purgeAccountData } from '../../lib/account_data';

const innerComponent = (account: Account) => {
  if (!account) {
    return null;
  } else if (account.platformName === SupportedPlatform.KuCoin) {
    return <KucoinRawData accountId={account.id}/>;
  } else if (account.blockchainName === SupportedBlockchain.Ethereum) {
    return <EtherscanLikeRawData accountId={account.id}/>;
  }

  return null;
}

const RawData = ({ accountId }) => {
  const account: Account = useLiveQuery(
    () => accountId && db.accounts.get(parseInt(accountId, 10)), [accountId]
  );

  const [accountIdForDataPurge, setAccountIdForDataPurge] = useState(-1);
  const [showPurgeConfirmation, setShowPurgeConfirmation] = useState(false);

  const handleClosePurgeConfirmation = () => setShowPurgeConfirmation(false);
  const handleShowPurgeConfirmation = (accountId) => {
    setAccountIdForDataPurge(accountId);
    setShowPurgeConfirmation(true);
  };
  const handleAccountDataPurge = async () => {
    await purgeAccountData(accountIdForDataPurge)
    setShowPurgeConfirmation(false);
  }

  if (!account) {
    return null;
  }

  const type = account.platformName || account.blockchainName;

  return <div className='my-2'>
    <Breadcrumb>
      <Link href="/accounts" passHref><Breadcrumb.Item>Accounts</Breadcrumb.Item></Link>
      <Breadcrumb.Item active>{type} - {account?.nickname}</Breadcrumb.Item>
    </Breadcrumb>

    <Button className='mb-2' variant="warning" onClick={() => handleShowPurgeConfirmation(account.id)}>
      Purge data
    </Button>

    {innerComponent(account)}
    <Modal show={showPurgeConfirmation} onHide={handleClosePurgeConfirmation}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClosePurgeConfirmation}>
          No
        </Button>
        <Button variant="dark" onClick={handleAccountDataPurge}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  </div>;
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