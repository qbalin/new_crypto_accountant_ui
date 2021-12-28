import { Attributes } from "@qbalin/new_crypto_accountant_utils";

export type EtherscanLikeInternalTransaction = Attributes['EtherscanLike']['InternalTransaction'] & { uiAccountId: number };

export const etherscanLikeInternalTransactionIndices = '++id,uiAccountId,createdAt';