import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { useStoryProtocol } from '@/hooks/useStoryProtocol';
import { supabase } from '@/integrations/supabase/client';
import { usePatents } from '@/hooks/usePatents';
import { uploadJSONToIPFS, getArtistByAddress } from '@/integrations/supabase/patents';
import { sha256 } from 'js-sha256';

interface RegisterPatentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patentData: any) => Promise<void>;
}

export const RegisterPatentModal = ({ isOpen, onClose, onSubmit }: RegisterPatentModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    patentNumber: '',
    filingDate: '',
    status: 'Pending',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const { isConnected, address } = useAccount();
  const { mintAndRegisterIpAssetWithPilTerms } = useStoryProtocol();
  const { refreshPatents } = usePatents();

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Patent title is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.patentNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "Patent number is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.filingDate) {
      toast({
        title: "Validation Error",
        description: "Filing date is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Patent description is required",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to register a patent",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);

    try {
      if (!address) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to register a patent.",
          variant: "destructive",
        });
        return;
      }

      const walletAddress: `0x${string}` = address as `0x${string}`;
      const artist = await getArtistByAddress(walletAddress);

      if (!artist) {
        toast({
          title: "Artist Not Registered",
          description: "Please register as an artist first to create a patent.",
          variant: "destructive",
        });
        return;
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
        category: formData.category, // Include category in IP metadata
        patentNumber: formData.patentNumber,
        filingDate: formData.filingDate,
        status: formData.status,
      };

      // 2. Prepare NFT Metadata (simplified for now)
      const nftMetadata = {
        name: formData.title,
        description: formData.description,
        image: "https://via.placeholder.com/150", // Placeholder image
        attributes: [
          {
            key: 'Creator',
            value: walletAddress,
          },
          {
            key: 'Category',
            value: formData.category,
          },
          {
            key: 'Patent Number',
            value: formData.patentNumber,
          },
          {
            key: 'Filing Date',
            value: formData.filingDate,
          },
        ],
      };

      // Upload metadata to IPFS
      const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
      const ipHash = sha256(JSON.stringify(ipMetadata));
      const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
      const nftHash = sha256(JSON.stringify(nftMetadata));

      // Step 1: Register IP Asset with Story Protocol
      // Note: The `metadata` field in `mintAndRegisterIpAssetWithPilTerms` expects a flat object.
      // We are passing the `ipMetadata` object directly for clarity in this step,
      // assuming the SDK handles its structure or takes a URI.
      const ipAsset = await mintAndRegisterIpAssetWithPilTerms({
        name: formData.title,
        description: formData.description,
        category: formData.category,
        metadata: ipMetadata, // Pass full ipMetadata object
      });

      // Step 2: Create patent in Supabase
      const patentToInsert = {
        artist_id: artist.id, // Use the fetched artist ID
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        patent_number: formData.patentNumber.trim(),
        filing_date: formData.filingDate,
        status: formData.status,
        ip_asset_id: ipAsset.id,
        ip_asset_address: ipAsset.address,
        ip_asset_chain: Number(ipAsset.chain),
        ip_metadata_uri: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ip_metadata_hash: `0x${ipHash}`,
        nft_metadata_uri: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nft_metadata_hash: `0x${nftHash}`,
        created_at: new Date().toISOString(),
        project_id: null, // Set project_id to null or a default value if not linked to a project
      };

      const { data: newPatent, error: patentInsertError } = await supabase
        .from('patents')
        .insert(patentToInsert)
        .select('id')
        .single();

      if (patentInsertError) throw patentInsertError;
      if (!newPatent) throw new Error("Failed to create patent in database.");

      // Step 3: Call the parent onSubmit function
      await onSubmit({
        ...newPatent,
        ip_asset_id: ipAsset.id,
        ip_asset_address: ipAsset.address,
        ip_asset_chain: ipAsset.chain,
      });

      // Reset form on success
      setFormData({
        title: '',
        description: '',
        category: '',
        patentNumber: '',
        filingDate: '',
        status: 'Pending',
      });

      onClose();
      await refreshPatents();

    } catch (error) {
      console.error('Patent registration error:', error);

      let errorMessage = "Failed to register patent";

      if (error instanceof Error) {
        if (error.message.includes("wallet")) {
          errorMessage = "Wallet connection required";
        } else if (error.message.includes("database")) {
          errorMessage = "Could not save patent to database";
        } else if (error.message.includes("ip_asset")) {
          errorMessage = "Patent saved, but failed to register IP asset";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error Registering Patent",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">Register New Patent</DialogTitle>
          <DialogDescription className="text-gray-400">
            Register your patent as an IP asset on the blockchain.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Patent Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter patent title"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Pharmaceutical">Pharmaceutical</SelectItem>
                  <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                  <SelectItem value="Medical Device">Medical Device</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="patentNumber">Patent Number</Label>
              <Input
                id="patentNumber"
                value={formData.patentNumber}
                onChange={(e) => setFormData({ ...formData, patentNumber: e.target.value })}
                placeholder="e.g., US12345678"
                required
              />
            </div>

            <div>
              <Label htmlFor="filingDate">Filing Date</Label>
              <Input
                id="filingDate"
                type="date"
                value={formData.filingDate}
                onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your patent"
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Granted">Granted</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-neon-gradient hover:opacity-90"
              disabled={isRegistering}
            >
              {isRegistering ? 'Registering Patent...' : 'Register Patent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 