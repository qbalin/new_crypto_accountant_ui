import { Attributes } from "@qbalin/new_crypto_accountant_utils";

export type CoinbaseAccount = Attributes['Coinbase']['Account'] & { uiAccountId: number };

export const coinbaseAccountIndices = 'id,uiAccountId';
