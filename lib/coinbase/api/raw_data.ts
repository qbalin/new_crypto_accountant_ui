import { CoinbaseClient } from '@qbalin/new_crypto_accountant_utils';

export default async function coinbaseRawDataHandler(req, res) {
  const productId = req.query.productId as string;
  const secret = req.query.privateApiSecret as string;
  const apiKey = req.query.privateApiKey as string;
  const apiPassphrase = req.query.privateApiPassphrase as string;
  const since = new Date(parseInt(req.query.since, 10));

  const client = new CoinbaseClient({ secret, apiKey, apiPassphrase });

  if (!productId) {
    const accounts = await client.call({ requestPath: '/accounts' });
    const usdcAccountId = accounts.find((a) => a.currency === 'USDC')?.id;
    const usdcLedger = await client.call({ requestPath: `/accounts/${usdcAccountId}/ledger`, since });
    const conversions = usdcLedger.filter((entry: { type: string }) => entry.type === 'conversion');
    const transfers = await client.call({ requestPath: '/transfers', since });
    const products = await client.call({ requestPath: '/products' });
    res.status(200).json({ accounts, conversions, products, transfers })
  } else {
    const fills = await client.call({ requestPath: `/fills?product_id=${productId}`, since });
    res.status(200).json({ fills })
  }
}