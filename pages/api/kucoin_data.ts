import { KucoinClient } from '@qbalin/new_crypto_accountant_utils';

export default async function handler(req, res) {
  const secret = req.query.privateApiSecret as string;
  const apiKey = req.query.privateApiKey as string;
  const apiPassphrase = req.query.privateApiPassphrase as string;
  const since = new Date(req.query.fetchFrom);

  const client = new KucoinClient({ secret, apiKey, apiPassphrase });
  const ledgers = await client.ledgers({ since });
  res.status(200).json({ ledgers })
}