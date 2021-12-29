import { CoinbaseClient } from '@qbalin/new_crypto_accountant_utils';

export default async function coinbaseRawDataHandler(req, res) {
  const secret = req.query.privateApiSecret as string;
  const apiKey = req.query.privateApiKey as string;
  const apiPassphrase = req.query.privateApiPassphrase as string;
  const since = new Date(parseInt(req.query.since, 10));

  const client = new CoinbaseClient({ secret, apiKey, apiPassphrase });

  const accounts = await client.call({ requestPath: '/accounts' });
  debugger;
  const usdcAccountId = accounts.find((a) => a.currency === 'USDC')?.id;
  console.log('usdcAccountId', usdcAccountId);
  const usdcLedger = await client.call({ requestPath: `/accounts/${usdcAccountId}/ledger`, since });
  console.log('usdcLedger', usdcLedger);
  const conversions = usdcLedger.filter((entry: { type: string }) => entry.type === 'conversion');
  console.log('conversions', conversions);

  const products = await client.call({ requestPath: '/products' });
  const fills = [];

  for (let i = 0; i < products.length; i += 1) {
    const productId = products[i].id;
    fills.push(...await client.call({ requestPath: `/fills?product_id=${productId}`, since }));
  }

  const transfers = await client.call({ requestPath: '/transfers', since });

  res.status(200).json({ accounts, conversions, products, fills, transfers })
}