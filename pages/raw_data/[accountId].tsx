import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs'
import { Breadcrumb, Modal, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router'
import { db } from "../../lib/db";
import { Account } from '../../lib/account';
import { purgeAccountData, syncAccount } from '../../lib/account_data';
import RawDataTables from '../../lib/pages/raw_data_tables';

const RawData = () => {
  const router = useRouter();
  const { accountId } = router.query;

  const account: Account = useLiveQuery(
    () => accountId && db.accounts.get(parseInt(accountId as string, 10)), [accountId]
  );

  const [showPurgeConfirmation, setShowPurgeConfirmation] = useState(false);

  const handleClosePurgeConfirmation = () => setShowPurgeConfirmation(false);
  const handleShowPurgeConfirmation = () => {
    setShowPurgeConfirmation(true);
  };
  const handleAccountDataPurge = async () => {
    await purgeAccountData(account.id)
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

    <Button className='m-2' variant="warning" onClick={handleShowPurgeConfirmation}>
      Purge data
    </Button>
    <Button className='m-2' variant="dark" onClick={() => syncAccount(account)}>
      Sync
    </Button>

    <RawDataTables account={account}/>

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

export default RawData;