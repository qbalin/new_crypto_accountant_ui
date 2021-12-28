import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs';
import { Table, Accordion } from 'react-bootstrap';
import { db } from "../../lib/db";

const KucoinRawData = ({ accountId }) => {
  const ledgerEntries = useLiveQuery(
    () => db.kucoinLedgerEntries.where({ uiAccountId: accountId }).toArray()
  );

  if (!ledgerEntries || ledgerEntries.length === 0) {
    return null;
  }

  const filteredData = ledgerEntries.map(entry => {
    const newEntry = {...entry};
    delete newEntry.uiAccountId;
    return newEntry;
  })

  const headers = Object.keys(filteredData[0]);

  return <Accordion>
    <Accordion.Item key={1} eventKey="1">
      <Accordion.Header>
        Ledger entries ({filteredData.length})
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
  </Accordion>
}

export default KucoinRawData;