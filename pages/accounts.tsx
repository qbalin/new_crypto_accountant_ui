import { db, SupportedBlockchains, SupportedPlatforms } from "../lib/db";
import { Button } from "react-bootstrap";
import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs'
import { Accordion, Card, Modal, Table } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Image from "next/image";
import { useState } from "react";

const accountsAvailable = {
  [SupportedPlatforms.Coinbase]: {
    platform: SupportedPlatforms.Coinbase,
    subType: 'centralized',
    name: 'Coinbase Pro',
    fields: [
      {name: 'nickname', label: 'Unique account nickname'},
      {name: 'privateApiKey', label: 'Private API key'},
      {name: 'privateApiSecret', label: 'Private API secret'},
      {name: 'privateApiPassphrase', label: 'Private API passphrase'}
    ],
    iconPath: '/images/coinbase_pro_logo.svg',
  },
  [SupportedBlockchains.Ethereum]: {
    platform: SupportedBlockchains.Ethereum,
    subType: 'decentralized',
    name: 'Ethereum',
    fields: [
      {name: 'nickname', label: 'Unique account nickname'},
      {name: 'blockchainExplorerApiKey', label: 'Blockchain explorer API key'},
      {name: 'walletAddress', label: 'Wallet Address'},
    ],
    iconPath: '/images/ethereum_logo.png',
  },
}

const Accounts = () => {
  const [show, setShow] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [accountType, setAccountType] = useState(Object.values(accountsAvailable)[0]);
  const [accoundIdForDeletion, setAccoundIdForDeletion] = useState(-1);


  const handleClose = () => setShow(false);
  const handleShow = (platform) => {
    const accountAvailable = accountsAvailable[platform];
    setAccountType(accountAvailable);
    setShow(true)
  };
  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = (accountId) => {
    setAccoundIdForDeletion(accountId);
    setShowConfirmation(true);
  };
  const handleAccountDeletion = () => {
    db.accounts.delete(accoundIdForDeletion);
    setShowConfirmation(false);
  }

  const accounts = useLiveQuery(
    () => db.accounts.toArray()
  );

  const displayAccounts = () => {
    if (accounts?.length) {
      return <Accordion>
        {accounts.map((account, index) => {
          const accountType = accountsAvailable[account.platformName] || accountsAvailable[account.blockchainName];
          return (
            <Accordion.Item key={account.id} eventKey={index}>
              <Accordion.Header>
                <span className="mx-2">
                  <Image src={accountType.iconPath} width={32} height={32}/>
                </span>
                {account.nickname}
              </Accordion.Header>
              <Accordion.Body>
                <Table striped bordered hover>
                  <tbody>
                    {
                      Object.entries(account)
                        .filter(([key, value]) => !['nickname', 'id'].includes(key))
                        .map(([key ,value]) => (
                            <tr key={key}>
                              <td>{key}</td>
                              <td>{value}</td>
                            </tr>
                          )
                        )
                    }
                  </tbody>
                </Table>
                <Button variant="danger" onClick={() => handleShowConfirmation(account.id)}>Delete</Button>
              </Accordion.Body>
            </Accordion.Item>
          )})}
      </Accordion>
    } else {
      return 'No account registered yet';
    }
  }

  const accountInputForm = () => {
    const fields = accountType.fields;
    const platformName = accountType.platform;
    const initialValues = fields.reduce((memo, field) => { memo[field.name] = ''; return memo }, {})

    const renderFields = () => {
      return fields.map(field =>
        <div key={field.name}>
          <label className="form-label" htmlFor={field.name}>{field.label}</label>
          <Field className="form-control" type="text" name={field.name} id={field.name} />
          <ErrorMessage name={field.name} component="div" />
        </div>
      );
    }
    return (
      <Formik
        initialValues={initialValues}
        validate={(values: any) => {
          const errors : Record<string, string> = {};
          if (values.nickname && values.nickname.length < 3) {
            errors.nickname = 'Nickname must me more than 3 characters long';
          }
          fields.forEach(field => {
            if (!values[field.name]) {
             errors[field.name] = 'Required';
            }
          });
          return errors;
        }}
        onSubmit={ async (values, { setFieldError }) => {
          let platformOrBlockchain: { platformName?: string, blockchainName?: string } = {};
          if (accountType.subType === 'centralized') {
            platformOrBlockchain.platformName = platformName
          } else {
            platformOrBlockchain.blockchainName = platformName
          }

          db.accounts.add({ ...values, ...platformOrBlockchain })
            .then(handleClose)
            .catch((error) => {
              if (error.message.match(/Unable to add key to index 'nickname': at least one key does not satisfy the uniqueness requirements./)) {
                setFieldError('nickname', 'Choose a unique nickname accross all your accounts');
              } else if (error.message.match(/Unable to add key to index '\[platformName\+privateApiKey\+privateApiPassphrase\+privateApiSecret\]': at least one key does not satisfy the uniqueness requirements./)) {
                setFieldError('nickname', 'You already registered this account.');
              } else if (error.message.match(/Unable to add key to index '\[walletAddress\+blockchainName\+blockchainExplorerApiKey\]': at least one key does not satisfy the uniqueness requirements./)) {
                setFieldError('nickname', 'You already registered this account.');
              } else {
                throw error;
              }
            });
        }}
     >
       {({
         isSubmitting,
       }) => (
         <>
           <Modal.Header closeButton>
             <Modal.Title>Add {accountType.platform} account</Modal.Title>
           </Modal.Header>
            <Form>
              <Modal.Body>
                {renderFields()}
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="dark" type="submit" disabled={isSubmitting}>
                    Add
                  </Button>
                </Modal.Footer>
              </Modal.Body>
            </Form>
         </>
       )}
     </Formik>
    )
  }

  return (
    <div>
      <h2>Your accounts</h2>
      {displayAccounts()}
      <h2>Add accounts</h2>
      {
        Object.values(accountsAvailable).map(accountAvailable => {
          return <>
            <Card key={accountAvailable.platform} className="my-2">
              <Card.Body>
                <Card.Title className="d-flex align-items-center">
                  <span className="mx-2">
                    <Image src={accountAvailable.iconPath} width={32} height={32}/>
                  </span>
                  <span className="align-self-center">{accountAvailable.name}</span>
                  <Button className="ms-auto" variant="dark" onClick={() => handleShow(accountAvailable.platform)}>
                    Add
                  </Button>
                </Card.Title>
              </Card.Body>
            </Card>
          </>
        })
      }
      <Modal show={show} onHide={handleClose}>
        {
          accountInputForm()
        }
      </Modal>
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            No
          </Button>
          <Button variant="dark" onClick={handleAccountDeletion}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Accounts;