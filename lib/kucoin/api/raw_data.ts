import { KucoinClient } from '@qbalin/new_crypto_accountant_utils';

export default async function kucoinRawDataHandler(req, res) {
  const secret = req.query.privateApiSecret as string;
  const apiKey = req.query.privateApiKey as string;
  const apiPassphrase = req.query.privateApiPassphrase as string;
  const since = new Date(parseInt(req.query.since, 10));
  const until = new Date(parseInt(req.query.until, 10));

  const client = new KucoinClient({ secret, apiKey, apiPassphrase });
  const ledgers = await client.ledgers({ since, until });
  res.status(200).json({ ledgers })
}