'use client';

import { useState } from 'react';
import { useCagnotte, useDonations, useActualites, useStats } from '../hooks/useCagnotte';

interface ApiTestPanelProps {
  cagnotteId: string;
  userId?: string;
}

export default function ApiTestPanel({ cagnotteId, userId }: ApiTestPanelProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [testDonation, setTestDonation] = useState({
    donor_name: 'Test Donateur',
    amount: 25000,
    comment: 'Don de test via l\'interface',
    is_anonymous: false
  });
  const [testActualite, setTestActualite] = useState({
    title: 'Actualité de test',
    content: 'Ceci est une actualité créée via l\'interface de test.',
    is_published: true
  });

  // Utiliser les hooks
  const { cagnotte, loading: cagnotteLoading, error: cagnotteError, refetch } = useCagnotte(cagnotteId);
  const { donations, loading: donationsLoading, error: donationsError, createDonation } = useDonations(cagnotteId);
  const { actualites, loading: actualitesLoading, error: actualitesError, createActualite } = useActualites(cagnotteId, userId);
  const { stats, loading: statsLoading, error: statsError } = useStats(cagnotteId, userId);

  const handleCreateDonation = async () => {
    const success = await createDonation(testDonation);
    if (success) {
      alert('Don créé avec succès !');
      refetch(); // Recharger les données de la cagnotte
    }
  };

  const handleCreateActualite = async () => {
    const success = await createActualite(testActualite);
    if (success) {
      alert('Actualité créée avec succès !');
      refetch(); // Recharger les données de la cagnotte
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Ne pas afficher en production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Panel de test des APIs"
      >
        🧪
      </button>

      {showPanel && (
        <div className="absolute bottom-16 right-0 w-96 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">Test des APIs</h3>

          {/* Statut de la cagnotte */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Cagnotte</h4>
            <div className="text-sm">
              <p>Loading: {cagnotteLoading ? '✅' : '❌'}</p>
              <p>Error: {cagnotteError || 'Aucune'}</p>
              <p>Données: {cagnotte ? '✅' : '❌'}</p>
              {cagnotte && (
                <p>Titre: {cagnotte.title}</p>
              )}
            </div>
          </div>

          {/* Statut des dons */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Dons ({donations.length})</h4>
            <div className="text-sm mb-2">
              <p>Loading: {donationsLoading ? '✅' : '❌'}</p>
              <p>Error: {donationsError || 'Aucune'}</p>
            </div>
            
            {/* Test de création de don */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nom du donateur"
                value={testDonation.donor_name}
                onChange={(e) => setTestDonation({...testDonation, donor_name: e.target.value})}
                className="w-full p-1 border rounded text-sm"
              />
              <input
                type="number"
                placeholder="Montant"
                value={testDonation.amount}
                onChange={(e) => setTestDonation({...testDonation, amount: parseInt(e.target.value)})}
                className="w-full p-1 border rounded text-sm"
              />
              <input
                type="text"
                placeholder="Commentaire"
                value={testDonation.comment}
                onChange={(e) => setTestDonation({...testDonation, comment: e.target.value})}
                className="w-full p-1 border rounded text-sm"
              />
              <button
                onClick={handleCreateDonation}
                className="w-full bg-green-600 text-white p-1 rounded text-sm hover:bg-green-700"
              >
                Créer Don Test
              </button>
            </div>
          </div>

          {/* Statut des actualités */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Actualités ({actualites.length})</h4>
            <div className="text-sm mb-2">
              <p>Loading: {actualitesLoading ? '✅' : '❌'}</p>
              <p>Error: {actualitesError || 'Aucune'}</p>
            </div>

            {userId && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Titre de l'actualité"
                  value={testActualite.title}
                  onChange={(e) => setTestActualite({...testActualite, title: e.target.value})}
                  className="w-full p-1 border rounded text-sm"
                />
                <textarea
                  placeholder="Contenu de l'actualité"
                  value={testActualite.content}
                  onChange={(e) => setTestActualite({...testActualite, content: e.target.value})}
                  className="w-full p-1 border rounded text-sm h-16"
                />
                <button
                  onClick={handleCreateActualite}
                  className="w-full bg-purple-600 text-white p-1 rounded text-sm hover:bg-purple-700"
                >
                  Créer Actualité Test
                </button>
              </div>
            )}
          </div>

          {/* Statut des statistiques */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Statistiques</h4>
            <div className="text-sm">
              <p>Loading: {statsLoading ? '✅' : '❌'}</p>
              <p>Error: {statsError || 'Aucune'}</p>
              <p>Données: {stats ? '✅' : '❌'}</p>
              {stats && (
                <div>
                  <p>Total: {stats.basic_stats?.total_amount || 0} XOF</p>
                  <p>Participants: {stats.basic_stats?.participants_count || 0}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={refetch}
              className="flex-1 bg-blue-600 text-white p-2 rounded text-sm hover:bg-blue-700"
            >
              Recharger
            </button>
            <button
              onClick={() => setShowPanel(false)}
              className="flex-1 bg-gray-600 text-white p-2 rounded text-sm hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
