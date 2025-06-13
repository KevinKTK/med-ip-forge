import { supabase } from './client'
import { Patent } from './types'
import { sha256 } from 'js-sha256'
import axios from 'axios'
import { Address, zeroAddress } from 'viem'

// Helper to get artist by wallet address
export async function getArtistByAddress(walletAddress: `0x${string}`) {
  const { data, error } = await supabase
    .from('artists')
    .select('id')
    .eq('wallet_address', walletAddress) 
    .single()

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return null;
    }
    throw error;
  }
  return data;
}

const getPinataJWT = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-api-keys')

    if (error) throw error

    return data.PINATA_JWT
  } catch (error) {
    console.error('Failed to get Pinata JWT from Supabase:', error)
    return null
  }
}

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  const pinataJWT = await getPinataJWT()
  if (!pinataJWT) {
    console.error('Pinata JWT is missing or null. Cannot upload to IPFS.');
    throw new Error('Failed to get Pinata JWT')
  }

  console.log('Pinata JWT successfully retrieved.');
  // console.log('Pinata JWT (first 10 chars): ', pinataJWT.substring(0, 10)); // Log only a part for security

  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pinataJWT}`,
      'Content-Type': 'application/json',
    },
    data: {
      pinataOptions: { cidVersion: 0 },
      pinataMetadata: { name: 'ip-metadata.json' },
      pinataContent: jsonMetadata,
    },
  }

  console.log('Sending request to Pinata with headers:', options.headers);

  try {
    const response = await axios(url, options)
    return response.data.IpfsHash
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error)
    throw error
  }
}

export async function registerPatent(
  artistId: number,
  title: string,
  description: string,
  ipMetadata: any,
  nftMetadata: any,
  projectId: number | null = null // Add optional projectId
): Promise<Patent> {
  // Upload metadata to IPFS
  const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
  const ipHash = sha256(JSON.stringify(ipMetadata))
  const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
  const nftHash = sha256(JSON.stringify(nftMetadata))

  // Create patent record in Supabase
  const { data, error } = await supabase
    .from('patents')
    .insert({
      artist_id: artistId,
      title,
      description,
      ip_metadata_uri: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      ip_metadata_hash: `0x${ipHash}`,
      nft_metadata_uri: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      nft_metadata_hash: `0x${nftHash}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      project_id: projectId
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePatentWithIPId(
  patentId: string,
  ipId: string,
  transactionHash: string
): Promise<Patent> {
  const { data, error } = await supabase
    .from('patents')
    .update({
      ip_id: ipId,
      transaction_hash: transactionHash,
      status: 'registered'
    })
    .eq('id', patentId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePatentWithLicenseTerms(
  patentId: string,
  licenseTermsIds: string[]
): Promise<Patent> {
  const { data, error } = await supabase
    .from('patents')
    .update({
      license_terms_ids: licenseTermsIds,
      status: 'licensed'
    })
    .eq('id', patentId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPatentsByArtist(artistId: number): Promise<Patent[]> {
  const { data, error } = await supabase
    .from('patents')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getPatentById(patentId: string): Promise<Patent> {
  const { data, error } = await supabase
    .from('patents')
    .select('*')
    .eq('id', patentId)
    .single()

  if (error) throw error
  return data
}

let cachedSpgNftContractAddress: Address | null = null

export async function getSPGNFTContractAddress(): Promise<Address> {
  if (cachedSpgNftContractAddress) {
    return cachedSpgNftContractAddress
  }

  try {
    const { data, error } = await supabase.functions.invoke('get-api-keys')

    if (error) throw error

    const address = data.VITE_PUBLIC_SPG_NFT_CONTRACT_ADDRESS as Address
    if (!address) {
      throw new Error('SPG NFT contract address not found')
    }

    cachedSpgNftContractAddress = address
    return address
  } catch (error) {
    console.error('Failed to get SPG NFT contract address:', error)
    return zeroAddress
  }
}