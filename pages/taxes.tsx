import { Button } from "react-bootstrap";
import { useState } from "react"
import { rawDataBundle } from "../lib/account_data";

const Taxes = () => {
  const [bundle, setBundle] = useState([]);

  const computeTaxEvents = async () => {
    const rawData = await rawDataBundle();
    setBundle(rawData);
    fetch('/api/recompute_tax_events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rawData)
    })
  };

  return <>
    <Button className="my-2" variant="dark" onClick={computeTaxEvents}>Re-compute tax events</Button>
    {JSON.stringify(bundle)}
  </>
}

export default Taxes;