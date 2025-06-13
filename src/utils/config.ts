import { Address, zeroAddress } from 'viem'

export const SPGNFTContractAddress: Address = import.meta.env.VITE_SPG_NFT_CONTRACT_ADDRESS as Address || zeroAddress