import { SupportedBlockchain, SupportedPlatform } from "@qbalin/new_crypto_accountant_utils";

export interface Account {
  id: number;
  platformName?: SupportedPlatform,
  privateApiKey?: string,
  privateApiPassphrase?: string,
  privateApiSecret?: string,
  nickname: string,
  walletAddress?: string,
  blockchainName?: SupportedBlockchain,
  blockchainExplorerApiKey?: string,
}

export const accountIndices = '++id, &nickname, &[platformName+privateApiKey+privateApiPassphrase+privateApiSecret], &[walletAddress+blockchainName+blockchainExplorerApiKey]';