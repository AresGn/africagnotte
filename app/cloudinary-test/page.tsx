'use client';

import { useState } from 'react';
import { CldUploadWidget, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import Image from 'next/image';

// Interface pour la structure d'erreur attendue du widget
interface CloudinaryErrorObject {
  status?: string;
  statusText?: string;
  [key: string]: unknown; // Remplacer any par unknown pour une meilleure sécurité de type
}

export default function CloudinaryTestPage() {
  const [resource, setResource] = useState<CloudinaryUploadWidgetInfo | undefined>();
  const [error, setError] = useState<string | undefined>();

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY; // Included as provided by user

  if (!uploadPreset || !cloudName || !apiKey) {
    const missingVars: string[] = [];
    if (!uploadPreset) missingVars.push("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
    if (!cloudName) missingVars.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
    if (!apiKey) missingVars.push("NEXT_PUBLIC_CLOUDINARY_API_KEY");
    return (
      <main style={{ padding: '2rem', color: 'red' }}>
        <h1>Erreur de Configuration</h1>
        <p>Les variables d&apos;environnement suivantes sont manquantes ou non chargées côté client :</p>
        <ul>
          {missingVars.map(v => <li key={v}>{v}</li>)}
        </ul>
        <p>Veuillez vérifier votre fichier `.env.local` et redémarrer votre serveur.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Test d&apos;Upload Cloudinary (Non Signé)</h1>
      <p>Utilisation des variables d&apos;environnement :</p>
      <ul>
        <li>Cloud Name: {cloudName}</li>
        <li>Upload Preset: {uploadPreset}</li>
        <li>API Key: {apiKey}</li>
      </ul>

      <CldUploadWidget
        uploadPreset={uploadPreset} // For unsigned uploads, uploadPreset is a direct prop
        options={{
          cloudName: cloudName,
          apiKey: apiKey,
          sources: ['local', 'url'],
          multiple: false,
          // folder: 'test-uploads', // Optionnel: pour spécifier un dossier
        }}
        onSuccess={(result: CloudinaryUploadWidgetResults) => {
          if (result.event === 'success' && result.info && typeof result.info === 'object') {
            console.log('Upload Test Page - Success:', result.info);
            setResource(result.info as CloudinaryUploadWidgetInfo);
            setError(undefined);
          } else if (result.event === 'success' && typeof result.info === 'string') {
            console.warn('Upload Test Page - Success with string info:', result.info);
            setError("Upload réussi mais format de réponse inattendu.");
          }
        }}
        onError={(errorResult: unknown) => { 
          console.error('Upload Test Page - Error:', errorResult);
          let errorMessage = 'Erreur inconnue du widget';
          if (typeof errorResult === 'object' && errorResult !== null) {
            const err = errorResult as CloudinaryErrorObject;
            errorMessage = err.statusText || err.status || errorMessage;
          }
          setError(`Erreur d&apos;upload: ${errorMessage}`);
          setResource(undefined);
        }}
      >
        {({ open }) => {
          function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
            e.preventDefault();
            setResource(undefined);
            setError(undefined);
            if (open) {
              open();
            } else {
              console.error("Test Page: La fonction open() du widget n&apos;est pas disponible.");
              alert("Impossible d&apos;ouvrir le widget d&apos;upload. Vérifiez la console.");
            }
          }
          return (
            <button 
              onClick={handleOnClick} 
              style={{ 
                padding: '12px 20px', 
                marginTop: '20px', 
                fontSize: '16px', 
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px'
              }}
            >
              Uploader une Image (Test)
            </button>
          );
        }}
      </CldUploadWidget>

      {error && (
        <div style={{ marginTop: '2rem', color: 'red', border: '1px solid red', padding: '10px' }}>
          <h2>Erreur :</h2>
          <p>{error}</p>
        </div>
      )}

      {resource && (
        <div style={{ marginTop: '2rem', border: '1px solid #eee', padding: '10px' }}>
          <h2>Image Uploadée :</h2>
          <p>Public ID: {resource.public_id}</p>
          {resource.secure_url && (
            <div style={{ maxWidth: '400px', margin: '10px 0' }}>
              <Image 
                src={resource.secure_url} 
                alt={`Uploaded: ${resource.public_id}`} 
                width={resource.width || 300} 
                height={resource.height || 300} 
                style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
              />
            </div>
          )}
          <h3>Détails de la ressource :</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflowX: 'auto' }}>
            {JSON.stringify(resource, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
} 