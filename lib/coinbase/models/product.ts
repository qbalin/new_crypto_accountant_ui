import { Attributes } from "@qbalin/new_crypto_accountant_utils";

export type CoinbaseProduct = Attributes['Coinbase']['Product'] & { uiAccountId: number };

export const coinbaseProductIndices = 'id,uiAccountId';
