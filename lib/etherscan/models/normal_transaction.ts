import { Attributes } from "@qbalin/new_crypto_accountant_utils";

export type EtherscanLikeNormalTransaction = Attributes['EtherscanLike']['NormalTransaction'] & { uiAccountId: number };

export const etherscanLikeNormalTransactionIndices = '++,uiAccountId,createdAt';