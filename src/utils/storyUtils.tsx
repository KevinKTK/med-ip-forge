
import { sha256 } from 'js-sha256';
import { supabase } from '@/utils/supabase';

const uploadMetadataToIpfs = async (formData: any) => {
  // 1. Create the metadata JSON object
  const metadata = {
    name: formData.title,
    description: formData.description,
    external_url: "https://your-project-website.com",
    attributes: [
      { trait_type: "Category", value: formData.category },
      { trait_type: "Funding Goal", value: formData.fundingGoal },
      { trait_type: "Duration", value: formData.duration },
      { trait_type: "Royalty Share", value: formData.royaltyShare },
    ],
    milestones: formData.milestones,
  };

  try {
    // 2. Call Supabase edge function to upload to IPFS using Pinata secrets
    const { data, error } = await supabase.functions.invoke('upload-to-ipfs', {
      body: {
        metadata: metadata,
        fileName: `${formData.title}-metadata.json`
      }
    });

    if (error) throw error;

    const metadataURI = `ipfs://${data.ipfsHash}`;
    const contentHash = sha256(JSON.stringify(metadata));

    console.log("Metadata uploaded successfully:", metadataURI);

    // 3. Return the URI and hash
    return { metadataURI, contentHash };

  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};

export { uploadMetadataToIpfs };
