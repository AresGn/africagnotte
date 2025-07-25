'use client';

import { useState } from 'react';
import { FaUpload, FaCheckCircle, FaExclamationTriangle, FaImage, FaTimes } from 'react-icons/fa';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface PreuvePaiementUploadProps {
  onPreuveUpload: (urlImage: string) => void;
  onAnnuler?: () => void;
  montant: number;
  operateur: string;
}

export default function PreuvePaiementUpload({
  onPreuveUpload,
  onAnnuler,
  montant
}: PreuvePaiementUploadProps) {
  const [imageUploadee, setImageUploadee] = useState<string | null>(null);

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.event === 'success' && result.info && typeof result.info === 'object') {
      const imageUrl = result.info.secure_url;
      setImageUploadee(imageUrl);
      onPreuveUpload(imageUrl);
      toast.success('Preuve de paiement téléchargée avec succès !');
    }
  };

  const handleError = (error: unknown) => {
    console.error('Erreur upload Cloudinary:', error);
    toast.error('Erreur lors du téléchargement de l&apos;image');
  };

  const supprimerImage = () => {
    setImageUploadee(null);
    toast('Image supprimée');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* En-tête */}
      <div className="flex items-center mb-4">
        <FaImage className="text-blue-600 text-2xl mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Preuve de paiement</h3>
          <p className="text-sm text-gray-600">
            Téléchargez une capture d&apos;écran de votre transfert de {montant.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <FaExclamationTriangle className="text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Important :</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Prenez une capture d&apos;écran de la confirmation de transfert</li>
              <li>• Assurez-vous que le montant et le numéro bénéficiaire sont visibles</li>
              <li>• L&apos;image doit être claire et lisible</li>
              <li>• Formats acceptés : JPG, PNG, WebP (max 10MB)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Zone d'upload */}
      {!imageUploadee ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onUpload={handleUpload}
            onError={handleError}
            options={{
              sources: ['local', 'camera'],
              multiple: false,
              maxFiles: 1,
              resourceType: 'image',
              clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
              maxFileSize: 10485760, // 10MB
              folder: 'africagnotte/preuves-paiement'
            }}
          >
            {({ open }) => (
              <div>
                <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Télécharger la preuve de paiement
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Cliquez pour sélectionner une image ou prendre une photo
                </p>
                <button
                  onClick={() => open()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <FaUpload />
                  Choisir une image
                </button>
              </div>
            )}
          </CldUploadWidget>
        </div>
      ) : (
        /* Image uploadée */
        <div className="space-y-4">
          <div className="relative">
            <Image
              src={imageUploadee}
              alt="Preuve de paiement"
              width={400}
              height={300}
              className="w-full h-64 object-cover rounded-lg border border-gray-300"
            />
            <button
              onClick={supprimerImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              <span className="font-medium text-green-800">
                Preuve de paiement téléchargée avec succès !
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Votre don sera traité une fois la preuve vérifiée par notre équipe.
            </p>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-3 mt-6">
        {onAnnuler && (
          <button
            onClick={onAnnuler}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Annuler
          </button>
        )}
        
        {imageUploadee && (
          <button
            onClick={() => toast.success('Don enregistré ! Vous recevrez une confirmation par email.')}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaCheckCircle />
            Confirmer le don
          </button>
        )}
      </div>
    </div>
  );
}
