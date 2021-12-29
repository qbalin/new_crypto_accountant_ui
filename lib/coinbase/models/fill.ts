import { Attributes } from "@qbalin/new_crypto_accountant_utils";

export type CoinbaseFill = Attributes['Coinbase']['Fill'] & { uiAccountId: number };

export const coinbaseFillIndices = 'trade_id,created_at,uiAccountId';
