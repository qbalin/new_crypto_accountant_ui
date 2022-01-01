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

const PolygonscanRawData = ({ accountId }) => {
  const normalTransactions = useLiveQuery(
    () => db.etherscanLikeNormalTransactions.where({ uiAccountId: accountId }).toArray()
  );
  const internalTransactions = useLiveQuery(
    () => db.etherscanLikeInternalTransactions.where({ uiAccountId: accountId }).toArray()
  );
  const tokenTransactions = useLiveQuery(
    () => db.etherscanLikeTokenTransactions.where({ uiAccountId: accountId }).toArray()
  );

  return <Accordion>
    {showTable(normalTransactions, 'Normal transactions', 1)}
    {showTable(internalTransactions, 'Internal transactions', 2)}
    {showTable(tokenTransactions, 'Token transactions', 3)}
  </Accordion>
}

export default PolygonscanRawData;