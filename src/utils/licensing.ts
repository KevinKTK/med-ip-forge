import { LicenseTerms } from '@story-protocol/core-sdk'
import { Address, parseEther, zeroAddress } from 'viem'

export const RoyaltyPolicyLAP: Address = '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E'
export const RoyaltyPolicyLRP: Address = '0x9156e603C949481883B1d3355c6f1132D191fC41'

export function createCommercialRemixTerms(terms: { commercialRevShare: number; defaultMintingFee: number }): LicenseTerms {
  return {
    transferable: true,
    royaltyPolicy: RoyaltyPolicyLAP,
    defaultMintingFee: parseEther(terms.defaultMintingFee.toString()),
    expiration: BigInt(0),
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: '0x',
    commercialRevShare: terms.commercialRevShare,
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt(0),
    currency: zeroAddress,
    uri: 'https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/CommercialRemix.json',
  }
} 