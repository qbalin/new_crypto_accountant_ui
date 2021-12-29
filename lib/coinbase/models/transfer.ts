import { Attributes } from "@qbalin/new_crypto_accountant_utils";

export type CoinbaseTransfer = Attributes['Coinbase']['Transfer'] & { uiAccountId: number };

export const coinbaseTransferIndices = 'id,created_at,uiAccountId';
