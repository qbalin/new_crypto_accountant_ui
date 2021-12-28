import { useLiveQuery } from 'dexie-react-hooks/dist/dexie-react-hooks.mjs';
import { Table } from 'react-bootstrap';
import { db } from "../../lib/db";

const KucoinRawData = ({ accountId }) => {
  const ledgerEntries = useLiveQuery(
    () => db.kucoinLedgerEntries.where({ uiAccountId: accountId }).toArray()
  );

  if (!ledgerEntries || ledgerEntries.length === 0) {
    return null;
  }

  const headers = Object.keys(ledgerEntries[0]);

  return <Table striped>
    <thead>
      <tr>
        {headers.map(header => <th key={header}>{header}</th>)}
      </tr>
    </thead>
    <tbody>
      {ledgerEntries.map(entry => <tr key={Object.values(entry).join('-')}>
        {Object.values(entry).map(value => <td key={Object.values(entry).join('+') + value}>{value}</td>)}
      </tr>)}
    </tbody>
  </Table>
}

export default KucoinRawData;