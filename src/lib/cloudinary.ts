import { Cloudinary } from "@cloudinary/url-gen";

// Créer une instance Cloudinary
export const createCloudinary = () => {
  return new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
    url: {
      secure: true
    }
  });
};

// Configuration pour next-cloudinary
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
}; 