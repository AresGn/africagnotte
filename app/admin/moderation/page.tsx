'use client';

import { useState, useEffect } from 'react';
import { 
  FiShield, 
  FiSearch, 
  FiFilter,
  FiEye,
  FiCheck,
  FiClock,
  FiFileText,
  FiRefreshCw
} from 'react-icons/fi';



interface ReportStats {
  total_reports: number;
  pending_reports: number;
  reviewed_reports: number;
  resolved_reports: number;
}

export default function ModerationPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, [selectedStatus, selectedReason, searchTerm]);

  const fetchReports = async () => {
    try {
      // Simulation de données pour éviter les erreurs
      setStats({
        total_reports: 0,
        pending_reports: 0,
        reviewed_reports: 0,
        resolved_reports: 0
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold flex items-center">
          <FiShield className="mr-3" />
          Modération & Signalements
        </h1>
        <p className="text-orange-100 mt-2">Gestion des signalements et actions de modération</p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_reports}</p>
              </div>
              <FiFileText className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending_reports}</p>
              </div>
              <FiClock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Examinés</p>
                <p className="text-2xl font-bold text-blue-600">{stats.reviewed_reports}</p>
              </div>
              <FiEye className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved_reports}</p>
              </div>
              <FiCheck className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiSearch className="inline h-4 w-4 mr-1" />
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Titre, description, utilisateur..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFilter className="inline h-4 w-4 mr-1" />
              Statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="reviewed">Examinés</option>
              <option value="resolved">Résolus</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raison
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Toutes les raisons</option>
              <option value="fraud">Fraude</option>
              <option value="inappropriate">Contenu inapproprié</option>
              <option value="spam">Spam</option>
              <option value="other">Autre</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchReports}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center justify-center"
            >
              <FiRefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Message temporaire */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          Interface de modération en cours de développement. Les fonctionnalités de base sont disponibles.
        </p>
      </div>
    </div>
  );
}
