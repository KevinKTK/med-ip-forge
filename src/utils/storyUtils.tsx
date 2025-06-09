// Add this import at the top
import { sha256 } from 'js-sha256';

// Add this helper function inside your CreateProjectModal component,
// or in a separate utils file.

const uploadMetadataToIpfs = async (formData: any) => {
    // 1. Create the metadata JSON object
    const metadata = {
        name: formData.title,
        description: formData.description,
        // You can add any custom attributes you want here
        external_url: "https://your-project-website.com", // Optional: link to a project page
        attributes: [
            { trait_type: "Category", value: formData.category },
            { trait_type: "Funding Goal", value: formData.fundingGoal },
            { trait_type: "Duration", value: formData.duration },
            { trait_type: "Royalty Share", value: formData.royaltyShare },
        ],
        milestones: formData.milestones,
    };

    const pinataJwt = import.meta.env.NEXT_PUBLIC_PINATA_JWT;
    if (!pinataJwt) {
        throw new Error("Pinata JWT not found in environment variables.");
    }

    // 2. Upload the JSON to Pinata
    try {
        const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${pinataJwt}`,
            },
            body: JSON.stringify({
                pinataContent: metadata,
                pinataOptions: {
                    cidVersion: 1,
                },
                pinataMetadata: {
                    name: `${formData.title}-metadata.json`,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Pinata API Error: ${errorData.error?.reason || 'Failed to pin JSON'}`);
        }

        const { IpfsHash } = await response.json();
        const metadataURI = `ipfs://${IpfsHash}`;
        const contentHash = sha256(JSON.stringify(metadata));

        console.log("Metadata uploaded successfully:", metadataURI);

        // 3. Return the URI and hash
        return { metadataURI, contentHash };

    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        throw error;
    }
};