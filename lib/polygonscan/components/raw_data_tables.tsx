import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs';
import { Table, Accordion } from 'react-bootstrap';
import { db } from '../../db';

const showTable = (data, label, key) => {
  if (!data || data.length === 0) {
    return null;
  }

  const filteredData = data.map(entry =>
    Object.entries(entry).reduce((memo, [key, value]) => {
      if (key === 'uiAccountId') {
        return memo;
      }
      memo[key] = typeof value === 'object' ? JSON.stringify(value) : value
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