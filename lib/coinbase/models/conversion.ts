import { Attributes } from "@qbalin/new_crypto_accountant_utils";

export type CoinbaseConversion = Attributes['Coinbase']['Conversion'] & { uiAccountId: number };

export const coinbaseConversionIndices = 'id,created_at,uiAccountId';
