import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@services/supabase';

export interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  title?: string;
  uploadedBy: string;
  isPrivate: boolean;
  uploadDate: string;
}

interface GalleryContextType {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  uploadImage: (file: File, title?: string, isPrivate?: boolean) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  togglePrivacy: (id: string) => Promise<void>;
  getSharedImages: () => GalleryImage[];
  getPrivateImages: () => GalleryImage[];
}

export const GalleryContext = createContext<GalleryContextType>({
  images: [],
  loading: true,
  error: null,
  uploadImage: async () => {},
  deleteImage: async () => {},
  togglePrivacy: async () => {},
  getSharedImages: () => [],
  getPrivateImages: () => [],
});

interface GalleryProviderProps {
  children: ReactNode;
  weddingId: string;
  userId: string;
}

export const GalleryProvider = ({ children, weddingId, userId }: GalleryProviderProps) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('wedding_id', weddingId);
          
        if (error) throw error;
        
        setImages(data.map(img => ({
          id: img.id,
          url: img.url,
          thumbnail: img.thumbnail,
          title: img.title,
          uploadedBy: img.uploaded_by,
          isPrivate: img.is_private,
          uploadDate: img.upload_date
        })));
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };
    
    if (weddingId) {
      fetchImages();
    }
  }, [weddingId]);

  const uploadImage = async (file: File, title?: string, isPrivate: boolean = false) => {
    try {
      setLoading(true);
      
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${weddingId}/${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('wedding_images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('wedding_images')
        .getPublicUrl(filePath);
        
      // Create thumbnail (in a real app, you might use a cloud function for this)
      const thumbnailPath = `gallery/${weddingId}/${Date.now()}_thumb.${fileExt}`;
      
      // For demo purposes, we'll just use the same image as thumbnail
      // In a real app, you would resize the image
      const { error: thumbError } = await supabase.storage
        .from('wedding_images')
        .upload(thumbnailPath, file);
        
      if (thumbError) throw thumbError;
      
      const { data: thumbUrlData } = supabase.storage
        .from('wedding_images')
        .getPublicUrl(thumbnailPath);
      
      // Save to database
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([{
          wedding_id: weddingId,
          url: urlData.publicUrl,
          thumbnail: thumbUrlData.publicUrl,
          title: title || file.name,
          uploaded_by: userId,
          is_private: isPrivate,
          upload_date: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      setImages(prev => [...prev, {
        id: data.id,
        url: data.url,
        thumbnail: data.thumbnail,
        title: data.title,
        uploadedBy: data.uploaded_by,
        isPrivate: data.is_private,
        uploadDate: data.upload_date
      }]);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      // Get image data first to delete from storage
      const imageToDelete = images.find(img => img.id === id);
      if (!imageToDelete) return;
      
      // Extract file paths from URLs
      const urlParts = imageToDelete.url.split('/');
      const filePath = urlParts[urlParts.length - 1];
      
      const thumbUrlParts = imageToDelete.thumbnail.split('/');
      const thumbPath = thumbUrlParts[thumbUrlParts.length - 1];
      
      // Delete from storage
      await supabase.storage
        .from('wedding_images')
        .remove([`gallery/${weddingId}/${filePath}`, `gallery/${weddingId}/${thumbPath}`]);
      
      // Delete from database
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    }
  };

  const togglePrivacy = async (id: string) => {
    try {
      const image = images.find(img => img.id === id);
      if (!image) return;
      
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_private: !image.isPrivate })
        .eq('id', id);
        
      if (error) throw error;
      
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, isPrivate: !img.isPrivate } : img
      ));
    } catch (err) {
      console.error('Error toggling image privacy:', err);
      setError('Failed to update image privacy');
    }
  };

  const getSharedImages = () => {
    return images.filter(img => !img.isPrivate);
  };

  const getPrivateImages = () => {
    return images.filter(img => img.isPrivate);
  };

  return (
    <GalleryContext.Provider
      value={{
        images,
        loading,
        error,
        uploadImage,
        deleteImage,
        togglePrivacy,
        getSharedImages,
        getPrivateImages,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};
