'use client';

import { useState } from 'react';
import { CldUploadWidget, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetError } from 'next-cloudinary';

export default function TestCloudinary() {
  const [uploadResult, setUploadResult] = useState<CloudinaryUploadWidgetResults['info'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Afficher les variables d'environnement
  const cloudinaryConfig = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  };

  console.log('Cloudinary Configuration:', cloudinaryConfig);

  const handleUpload = (results: CloudinaryUploadWidgetResults) => {
    console.log('Upload results:', results);

    if (results.event === 'success' && results.info) {
      setUploadResult(results.info);
      setError(null);
    } else if (results.event === 'error') {
      setError('Erreur lors du téléchargement');
      console.error('Upload error:', results);
    }
  };

  const handleError = (error: CloudinaryUploadWidgetError) => {
    console.error('Widget error:', error);
    if (typeof error === 'string') {
      setError(`Erreur du widget: ${error}`);
    } else if (error && typeof error === 'object' && 'statusText' in error) {
      setError(`Erreur du widget: ${error.statusText || 'Erreur inconnue'}`);
    } else {
      setError('Erreur du widget: Erreur inconnue');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test Cloudinary Configuration</h1>

      {/* Affichage de la configuration */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Configuration Cloudinary</h2>
        <pre className="text-sm">
          {JSON.stringify(cloudinaryConfig, null, 2)}
        </pre>
      </div>

      {/* Widget de test */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Test d&apos;upload</h2>

        <div className="space-y-4">
          {/* Test avec notre preset */}
          <div>
            <h3 className="text-lg font-medium mb-2">Test avec notre preset &quot;africagnotte_media&quot;</h3>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onUpload={handleUpload}
              onError={handleError}
              options={{
                sources: ['local'],
                multiple: false,
                maxFiles: 1,
                resourceType: 'auto'
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                >
                  Tester avec africagnotte_media
                </button>
              )}
            </CldUploadWidget>
          </div>

          {/* Test avec un preset unsigned par défaut */}
          <div>
            <h3 className="text-lg font-medium mb-2">Test avec preset par défaut (si disponible)</h3>
            <CldUploadWidget
              uploadPreset="ml_default"
              onUpload={handleUpload}
              onError={handleError}
              options={{
                sources: ['local'],
                multiple: false,
                maxFiles: 1,
                resourceType: 'auto'
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Tester avec ml_default
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erreur:</strong> {error}
        </div>
      )}

      {/* Affichage du résultat */}
      {uploadResult && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <h3 className="font-semibold mb-2">Upload réussi!</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(uploadResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions pour créer le preset */}
      <div className="mt-8 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <h3 className="font-semibold mb-2">🔧 Dépannage du preset Cloudinary</h3>
        <div className="mb-4">
          <p className="font-semibold text-green-600">✅ PRESET CRÉÉ: Le preset &quot;africagnotte_media&quot; existe !</p>
          <p className="text-red-600 font-semibold">❌ PROBLÈME: &quot;Upload preset not found&quot;</p>
        </div>

        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-semibold text-red-800 mb-2">🚨 Actions de dépannage :</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
            <li><strong>Vérifiez que le preset est bien en mode &quot;Unsigned&quot;</strong> (pas &quot;Signed&quot;)</li>
            <li><strong>Sauvegardez le preset</strong> en cliquant sur &quot;Save&quot; dans Cloudinary</li>
            <li><strong>Attendez 2-3 minutes</strong> pour la propagation</li>
            <li><strong>Testez le bouton vert &quot;ml_default&quot;</strong> pour voir si Cloudinary fonctionne</li>
          </ol>
        </div>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            <strong>Connectez-vous à Cloudinary:</strong>
            <br />
            <a href="https://cloudinary.com/users/login" target="_blank" className="text-blue-600 underline">
              https://cloudinary.com/users/login
            </a>
          </li>
          <li>
            <strong>Naviguez vers Settings → Upload Presets</strong>
            <br />
            <span className="text-xs">Ou allez directement à: Settings → Upload dans le menu de gauche</span>
          </li>
          <li>
            <strong>Vérifiez que le preset &quot;africagnotte_media&quot; existe</strong>
          </li>
          <li>
            <strong>Configuration du preset:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li><strong>Preset name:</strong> <code className="bg-gray-200 px-1">africagnotte_media</code></li>
              <li><strong>Signing Mode:</strong> <span className="text-green-600 font-semibold">Unsigned ✅</span></li>
              <li><strong>Resource type:</strong> Auto</li>
              <li><strong>Asset folder:</strong> media/africagnotte</li>
            </ul>
          </li>
        </ol>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800 text-sm">
            <strong>💡 Astuce:</strong> Le mode &quot;Unsigned&quot; est essentiel pour permettre les uploads depuis votre application frontend sans exposer votre API secret.
          </p>
        </div>

        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800 text-sm font-semibold mb-2">🚀 Lien direct pour gérer les presets:</p>
          <a
            href={`https://console.cloudinary.com/settings/upload_presets?cloud_name=${cloudinaryConfig.cloudName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
          >
            Gérer les presets dans Cloudinary →
          </a>
          <p className="text-green-700 text-xs mt-2">
            Ce lien vous amènera directement à la page de gestion des presets dans votre tableau de bord Cloudinary.
          </p>
        </div>
      </div>
    </div>
  );
}
