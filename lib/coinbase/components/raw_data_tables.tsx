import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs';
import { Table, Accordion } from 'react-bootstrap';
import { db } from '../../db';

const showTable = (data, label, key) => {
  if (!data || data.length === 0) {
    return null;
  }

  const filteredData = data.map(entry =>
    Object.entries(entry).reduce((memo, [k, v]) => {
      if (k === 'uiAccountId') {
        return memo;
      }
      // eslint-disable-next-line no-param-reassign
      memo[k] = typeof v === 'object' ? JSON.stringify(v) : v
      return memo;
    }, {})
  )

  const headers = Object.keys(filteredData[0]);

  return <>
    <Accordion.Item key={key} eventKey={key.toString()}>
      <Accordion.Header>
        {label} ({filteredData.length})
      </Accordion.Header>
      <Accordion.Body>
        <Table striped hover responsive>
          <thead>
            <tr>
              {headers.map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredData.map(entry => <tr key={Object.values(entry).join('-')}>
              {Object.values(entry).map((value, index) => <td key={headers[index]}>{value}</td>)}
            </tr>)}
          </tbody>
        </Table>
      </Accordion.Body>
    </Accordion.Item>
  </>;
}

const CoinbaseRawData = ({ accountId }) => {
  const coinbaseFills = useLiveQuery(
    () => db.coinbaseFills.where({ uiAccountId: accountId }).toArray()
  );
  const coinbaseTransfers = useLiveQuery(
    () => db.coinbaseTransfers.where({ uiAccountId: accountId }).toArray()
  );
  const coinbaseConversions = useLiveQuery(
    () => db.coinbaseConversions.where({ uiAccountId: accountId }).toArray()
  );
  const coinbaseAccounts = useLiveQuery(
    () => db.coinbaseAccounts.where({ uiAccountId: accountId }).toArray()
  );
  const coinbaseProducts = useLiveQuery(
    () => db.coinbaseProducts.where({ uiAccountId: accountId }).toArray()
  );

  return <Accordion>
    {showTable(coinbaseFills, 'Fills', 1)}
    {showTable(coinbaseTransfers, 'Transfers', 2)}
    {showTable(coinbaseConversions, 'Conversions', 3)}
    {showTable(coinbaseAccounts, 'Accounts', 4)}
    {showTable(coinbaseProducts, 'Products', 5)}
  </Accordion>
}

export default CoinbaseRawData;