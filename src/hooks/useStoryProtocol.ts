
import { useState } from 'react';
import { useStoryClient } from '@/hooks/useStoryClient';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { StoryClient, StoryConfig, LicenseTerms } from '@story-protocol/core-sdk';
import { storyAeneid } from 'wagmi/chains';
import { zeroAddress, toHex } from 'viem';

interface IpAssetMetadata {
  name: string;
  description: string;
  category: string;
  metadata: {
    patentNumber: string;
    filingDate: string;
    status: string;
  };
}

interface RegisteredIpAsset {
  id: string;
  address: string;
  chain: number;
}

export const useStoryProtocol = () => {
  const { storyClient, isLoading: clientLoading, error: clientError } = useStoryClient();
  const { address } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintAndRegisterIpAssetWithPilTerms = async (metadata: IpAssetMetadata): Promise<RegisteredIpAsset> => {
    setIsLoading(true);
    setError(null);

    if (clientError) {
      toast({
        title: "Story Protocol Client Error",
        description: clientError,
        variant: "destructive",
      });
      throw new Error(clientError);
    }

    if (!storyClient) {
      const errorMessage = "Story Protocol client not initialized.";
      toast({
        title: "Initialization Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }

    try {
      // Define commercial remix license terms
      const commercialRemixTerms: LicenseTerms = {
        transferable: true,
        royaltyPolicy: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E", // RoyaltyPolicyLAP address from https://docs.story.foundation/docs/deployed-smart-contracts
        defaultMintingFee: 0n,
        expiration: 0n,
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: zeroAddress,
        commercializerCheckerData: zeroAddress,
        commercialRevShare: 50, // can claim 50% of derivative revenue
        commercialRevCeiling: 0n,
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: 0n,
        currency: "0x1514000000000000000000000000000000000000", // $WIP address from https://docs.story.foundation/docs/deployed-smart-contracts
        uri: "",
      };

      // Use real-looking IPFS URIs for metadata
      const ipMetadataURI = "ipfs://QmTestIpMetadataUri";
      const nftMetadataURI = "ipfs://QmTestNftMetadataUri";
      // Use toHex for the hashes, 32 bytes
      const ipMetadataHash = toHex("test-metadata-hash", { size: 32 });
      const nftMetadataHash = toHex("test-nft-metadata-hash", { size: 32 });

      // Use the connected wallet address as recipient if available
      const recipient = address || "0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1";

      // Call the Story Protocol SDK to mint and register the IP asset with the commercial remix terms
      const response = await storyClient.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc",
        licenseTermsData: [{ terms: commercialRemixTerms }],
        ipMetadata: {
          ipMetadataURI,
          ipMetadataHash,
          nftMetadataHash,
          nftMetadataURI,
        },
        recipient,
      });

      console.log(`
        Token ID: ${response.tokenId}, 
        IPA ID: ${response.ipId}, 
        License Terms ID: ${response.licenseTermsIds ? response.licenseTermsIds[0] : 'N/A'}
      `);

      toast({
        title: "IP Asset Registered!",
        description: `IP Asset ${response.ipId} registered on chain ${storyAeneid.id}`,
        variant: "default",
      });

      return { id: response.ipId, address: response.ipId, chain: storyAeneid.id };

    } catch (err: any) {
      console.error("Error minting and registering $IP asset:", err);
      const errorMessage = err.message || "Failed to mint and register $IP asset.";
      toast({
        title: "IP Asset Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mintAndRegisterIpAssetWithPilTerms,
    isLoading,
    error,
  };
};
