import { useState } from 'react';
import { FaCamera, FaVideo, FaTimes } from 'react-icons/fa';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';

interface MediaUploadProps {
  onImagesUpload: (urls: string[]) => void;
  onVideoUpload: (url: string) => void;
  images: string[];
  video: string | null;
}

export default function MediaUpload({ onImagesUpload, onVideoUpload, images, video }: MediaUploadProps) {
  const [isVideoUploaded, setIsVideoUploaded] = useState(!!video);

  const handleImageUpload = (results: CloudinaryUploadWidgetResults) => {
    if (results.event !== 'success' || !results.info) return;
    
    const info = results.info;
    const newImageUrl = typeof info === 'string' ? info : info.secure_url;
    
    if (newImageUrl) {
      onImagesUpload([...images, newImageUrl]);
    }
  };

  const handleVideoUpload = (results: CloudinaryUploadWidgetResults) => {
    if (results.event !== 'success' || !results.info) return;
    
    const info = results.info;
    
    if (typeof info !== 'string' && info.resource_type === 'video') {
      const videoUrl = info.secure_url;
      onVideoUpload(videoUrl);
      setIsVideoUploaded(true);
    } else {
      alert('Veuillez télécharger une vidéo.');
    }
  };

  const removeImage = (indexToRemove: number) => {
    onImagesUpload(images.filter((_, index) => index !== indexToRemove));
  };

  const removeVideo = () => {
    onVideoUpload('');
    setIsVideoUploaded(false);
  };

  return (
    <div className="space-y-4">
      {/* Section upload d'images */}
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2">Images (ajoutez plusieurs photos)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative h-24 sm:h-32 border rounded overflow-hidden">
              <Image 
                src={imageUrl} 
                alt={`Image ${index + 1}`} 
                fill 
                className="object-cover" 
              />
              <button 
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                onClick={() => removeImage(index)}
                type="button"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
          
          {/* Bouton pour ajouter des images */}
          <CldUploadWidget 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onUpload={handleImageUpload}
            options={{
              sources: ['local', 'url'],
              multiple: false,
              maxFiles: 1,
              resourceType: 'image'
            }}
          >
            {({ open }) => (
              <div 
                className="h-24 sm:h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => open()}
              >
                <div className="bg-gray-200 rounded-full p-2 mb-2">
                  <FaCamera className="text-gray-500" />
                </div>
                <span className="text-xs text-center px-2">Ajouter une image</span>
              </div>
            )}
          </CldUploadWidget>
        </div>
      </div>

      {/* Section upload de vidéo (une seule) */}
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2">Vidéo (optionnelle)</h3>
        
        {video && isVideoUploaded ? (
          <div className="relative mb-3">
            <video 
              src={video} 
              controls 
              className="w-full h-40 sm:h-56 object-cover rounded border"
            />
            <button 
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              onClick={removeVideo}
              type="button"
            >
              <FaTimes size={16} />
            </button>
          </div>
        ) : (
          <CldUploadWidget 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleVideoUpload}
            options={{
              sources: ['local', 'url'],
              multiple: false,
              maxFiles: 1,
              resourceType: 'video'
            }}
          >
            {({ open }) => (
              <div 
                className="p-6 sm:p-10 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => open()}
              >
                <div className="bg-gray-200 rounded-full p-3 sm:p-4 mb-2">
                  <FaVideo className="text-gray-500 text-xl sm:text-2xl" />
                </div>
                <p className="text-sm sm:text-base font-medium text-gray-600">Ajouter une vidéo</p>
                <p className="text-xs text-gray-500 mt-1">Format MP4 recommandé, 100MB max</p>
              </div>
            )}
          </CldUploadWidget>
        )}
      </div>
    </div>
  );
} 