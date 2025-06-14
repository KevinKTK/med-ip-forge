
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { getStoryClient } from '@/contexts/StoryKit'
import { registerPatent, updatePatentWithIPId, updatePatentWithLicenseTerms, getPatentsByArtist, getArtistByAddress } from '@/integrations/supabase/patents'
import { createCommercialRemixTerms } from '@/utils/licensing'
import { SPGNFTContractAddress } from '@/utils/config'
import { Tables } from '@/integrations/supabase/types'
import { Button } from '@/components/ui/button'

type Patent = Tables<'patents'>;

interface PatentManagementProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function PatentManagement({ isModalOpen, setIsModalOpen }: PatentManagementProps) {
  const { address } = useAccount()
  const [patents, setPatents] = useState<Patent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    mediaUrl: '',
    mediaType: '',
  })

  const [licenseTerms, setLicenseTerms] = useState({
    defaultMintingFee: 1,
    commercialRevShare: 5,
  })

  useEffect(() => {
    if (address) {
      loadPatents()
    }
  }, [address])

  const loadPatents = async () => {
    try {
      if (!address) return;
      const walletAddress: `0x${string}` = address as `0x${string}`;
      const artist = await getArtistByAddress(walletAddress);
      if (!artist) {
        setError("Artist not registered. Please register as an artist first.");
        return;
      }
      const patents = await getPatentsByArtist(artist.id)
      setPatents(patents)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleRegisterPatent = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!address) throw new Error('No wallet connected')

      const walletAddress: `0x${string}` = address as `0x${string}`;
      const artist = await getArtistByAddress(walletAddress);

      if (!artist) {
        throw new Error("Artist not registered. Please register as an artist first.");
      }

      // 1. Prepare IP Metadata
      const ipMetadata = {
        title: formData.title,
        description: formData.description,
        createdAt: Math.floor(Date.now() / 1000).toString(),
        creators: [
          {
            name: walletAddress,
            address: walletAddress,
            contributionPercent: 100,
          },
        ],
        image: formData.image,
        mediaUrl: formData.mediaUrl,
        mediaType: formData.mediaType,
      }

      // 2. Prepare NFT Metadata
      const nftMetadata = {
        name: formData.title,
        description: formData.description,
        image: formData.image,
        animation_url: formData.mediaUrl,
        attributes: [
          {
            key: 'Creator',
            value: walletAddress,
          },
        ],
      }

      // 3. Register patent in Supabase with correct arguments
      const patent = await registerPatent(
        artist.id,
        formData.title,
        formData.description,
        'Technology', // category
        new Date().toISOString(), // filing_date
        `TEMP-${Date.now()}`, // patent_number
        ipMetadata,
        nftMetadata,
        null // projectId
      )

      // 4. Get Story Protocol client
      const client = await getStoryClient(walletAddress)

      // 5. Register IP Asset
      const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [
          {
            terms: createCommercialRemixTerms({
              defaultMintingFee: licenseTerms.defaultMintingFee,
              commercialRevShare: licenseTerms.commercialRevShare,
            }),
          },
        ],
        ipMetadata: {
          ipMetadataURI: patent.ip_metadata_uri,
          ipMetadataHash: patent.ip_metadata_hash,
          nftMetadataURI: patent.nft_metadata_uri,
          nftMetadataHash: patent.nft_metadata_hash,
        },
      })

      // 6. Update patent with IP ID and license terms
      await updatePatentWithIPId(patent.id, response.ipId as `0x${string}`, response.txHash as `0x${string}`)
      await updatePatentWithLicenseTerms(patent.id, response.licenseTermsIds.map(id => id.toString()))

      // 7. Refresh patents list
      await loadPatents()

      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        image: '',
        mediaUrl: '',
        mediaType: '',
      })
      setIsModalOpen(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Register New Patent</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 absolute top-3 right-3"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleRegisterPatent} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700">
                  Media URL
                </label>
                <input
                  type="url"
                  name="mediaUrl"
                  id="mediaUrl"
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700">
                  Media Type
                </label>
                <input
                  type="text"
                  name="mediaType"
                  id="mediaType"
                  value={formData.mediaType}
                  onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g., audio/mpeg, video/mp4"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="defaultMintingFee" className="block text-sm font-medium text-gray-700">
                    Default Minting Fee (WIP)
                  </label>
                  <input
                    type="number"
                    name="defaultMintingFee"
                    id="defaultMintingFee"
                    value={licenseTerms.defaultMintingFee}
                    onChange={(e) => setLicenseTerms({ ...licenseTerms, defaultMintingFee: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="commercialRevShare" className="block text-sm font-medium text-gray-700">
                    Commercial Revenue Share (%)
                  </label>
                  <input
                    type="number"
                    name="commercialRevShare"
                    id="commercialRevShare"
                    value={licenseTerms.commercialRevShare}
                    onChange={(e) => setLicenseTerms({ ...licenseTerms, commercialRevShare: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="neon-border"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-neon-gradient hover:opacity-90"
                >
                  {loading ? 'Registering...' : 'Register Patent'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patents List Section - Always visible */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Your Registered Patents</h3>
          <div className="mt-5">
            {patents.length === 0 ? (
              <p className="text-sm text-gray-500">No patents registered yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {patents.map((patent) => (
                  <li key={patent.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{patent.title}</p>
                        <p className="text-sm text-gray-500 truncate">{patent.description}</p>
                        <p className="text-sm text-gray-500">
                          Status: <span className="capitalize">{patent.status}</span>
                        </p>
                        {patent.ip_id && (
                          <p className="text-sm text-gray-500">
                            IP ID: {patent.ip_id}
                          </p>
                        )}
                        {patent.project_id && (
                          <p className="text-sm text-gray-500">
                            Project ID: {patent.project_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
