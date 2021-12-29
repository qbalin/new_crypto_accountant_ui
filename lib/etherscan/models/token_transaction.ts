import { Attributes } from "@qbalin/new_crypto_accountant_utils";

export type EtherscanLikeTokenTransaction = Attributes['EtherscanLike']['TokenTransaction'] & { uiAccountId: number };

export const etherscanLikeTokenTransactionIndices = '++,uiAccountId,createdAt';