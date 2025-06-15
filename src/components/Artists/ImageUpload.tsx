
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUpload = ({ images, onChange, maxImages = 5 }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const uploadImage = useCallback(async (file: File) => {
    if (!file) return null;

    console.log('Starting image upload:', { 
      fileName: file.name, 
      fileSize: file.size, 
      fileType: file.type 
    });

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `project-images/${fileName}`;

    console.log('Uploading to path:', filePath);

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to upload images');
    }

    console.log('User authenticated:', user.id);

    const { error: uploadError } = await supabase.storage
      .from('project-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('File uploaded successfully');

    const { data } = supabase.storage
      .from('project-assets')
      .getPublicUrl(filePath);

    console.log('Generated public URL:', data.publicUrl);

    return data.publicUrl;
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    console.log('Files selected:', files.length);

    if (files.length === 0) {
      return;
    }

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress({});

    try {
      const uploadPromises = files.map(async (file, index) => {
        try {
          setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
          
          const url = await uploadImage(file);
          
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          
          return url;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
          throw error;
        }
      });

      const uploadedUrls = await Promise.allSettled(uploadPromises);
      
      const successfulUrls: string[] = [];
      const failedUploads: string[] = [];

      uploadedUrls.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          successfulUrls.push(result.value);
        } else {
          failedUploads.push(files[index].name);
          console.error(`Failed to upload ${files[index].name}:`, result.status === 'rejected' ? result.reason : 'Unknown error');
        }
      });

      if (successfulUrls.length > 0) {
        onChange([...images, ...successfulUrls]);
        
        toast({
          title: "Images uploaded",
          description: `${successfulUrls.length} image(s) uploaded successfully`,
        });
      }

      if (failedUploads.length > 0) {
        toast({
          title: "Some uploads failed",
          description: `Failed to upload: ${failedUploads.join(', ')}`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Upload process error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
      // Reset the input
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    
    toast({
      title: "Image removed",
      description: "Image has been removed from the project",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">
          Project Images ({images.length}/{maxImages})
        </label>
        
        {images.length < maxImages && (
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              className="neon-border"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Add Images
                </>
              )}
            </Button>
          </label>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Upload Progress:</p>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="flex items-center space-x-2">
              <span className="text-sm text-gray-300 flex-1 truncate">{fileName}</span>
              {progress === -1 ? (
                <span className="text-sm text-red-400">Failed</span>
              ) : progress === 100 ? (
                <span className="text-sm text-green-400">Complete</span>
              ) : (
                <span className="text-sm text-yellow-400">Uploading...</span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Project image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-600"
                onError={(e) => {
                  console.error('Image failed to load:', url);
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-400">No images uploaded yet</p>
          <p className="text-sm text-gray-500">Upload up to {maxImages} images to showcase your project</p>
          <p className="text-xs text-gray-600 mt-2">Supported formats: JPG, PNG, GIF (max 5MB each)</p>
        </div>
      )}
    </div>
  );
};
