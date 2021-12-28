import { Attributes } from "@qbalin/new_crypto_accountant_utils";

export type KucoinLedgerEntry = Attributes['Kucoin']['LedgerEntry'] & { uiAccountId: number };

export const kucoinLedgerEntryIndices = 'id,uiAccountId,createdAt';
