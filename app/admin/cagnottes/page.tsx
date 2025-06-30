'use client';

import { useState, useEffect } from 'react';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiSearch,
  FiFilter,
  FiEye,
  FiUser,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface Cagnotte {
  id: string;
  title: string;
  description: string;
  category: string;
  target_amount: number | null;
  current_amount: number;
  status: string;
  moderation_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  moderation_notes: string | null;
  moderated_at: string | null;
  created_at: string;
  creator: {
    username: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  moderator: {
    username: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface ApiResponse {
  cagnottes: Cagnotte[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  stats: Record<string, number>;
}

const statusConfig = {
  pending: {
    label: 'En attente',
    icon: FiClock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  approved: {
    label: 'Approuvée',
    icon: FiCheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  rejected: {
    label: 'Rejetée',
    icon: FiXCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  suspended: {
    label: 'Suspendue',
    icon: FiAlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
};

export default function AdminCagnottes() {
  const [cagnottes, setCagnottes] = useState<Cagnotte[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  });

  const fetchCagnottes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedStatus) params.append('status', selectedStatus);
      if (searchTerm) params.append('search', searchTerm);
      params.append('limit', pagination.limit.toString());
      params.append('offset', pagination.offset.toString());

      const response = await fetch(`/api/admin/cagnottes?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des cagnottes');
      }

      const data: ApiResponse = await response.json();
      setCagnottes(data.cagnottes);
      setPagination(data.pagination);
      setStats(data.stats);

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des cagnottes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCagnottes();
  }, [selectedStatus, searchTerm, pagination.offset]);

  const handleModeration = async (cagnotteId: string, action: string, reason?: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/cagnottes/${cagnotteId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ action, reason, notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modération');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Recharger les données
      fetchCagnottes();

    } catch (error) {
      console.error('Erreur de modération:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la modération');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold flex items-center">
          <FiFileText className="mr-3" />
          Gestion des Cagnottes
        </h1>
        <p className="text-blue-100 mt-2">Modération et administration des campagnes</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
            <div className="flex items-center">
              <config.icon className={`h-8 w-8 ${config.color}`} />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{config.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stats[status] || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvées</option>
              <option value="rejected">Rejetées</option>
              <option value="suspended">Suspendues</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des cagnottes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cagnottes ({pagination.total})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {cagnottes.map((cagnotte) => {
            const statusInfo = statusConfig[cagnotte.moderation_status];
            
            return (
              <div key={cagnotte.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{cagnotte.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <statusInfo.icon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{cagnotte.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2" />
                        {cagnotte.creator.first_name && cagnotte.creator.last_name 
                          ? `${cagnotte.creator.first_name} ${cagnotte.creator.last_name}`
                          : cagnotte.creator.username
                        }
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-2" />
                        {formatDate(cagnotte.created_at)}
                      </div>
                      <div className="flex items-center">
                        <FiDollarSign className="w-4 h-4 mr-2" />
                        {formatAmount(cagnotte.current_amount)}
                        {cagnotte.target_amount && ` / ${formatAmount(cagnotte.target_amount)}`}
                      </div>
                    </div>

                    {cagnotte.moderation_notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">
                          <strong>Notes de modération:</strong> {cagnotte.moderation_notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    {cagnotte.moderation_status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleModeration(cagnotte.id, 'approve', 'Cagnotte conforme')}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center text-sm"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-2" />
                          Approuver
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Raison du rejet:');
                            if (reason) handleModeration(cagnotte.id, 'reject', reason);
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center text-sm"
                        >
                          <FiXCircle className="w-4 h-4 mr-2" />
                          Rejeter
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => window.open(`/c/${cagnotte.id}`, '_blank')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center text-sm"
                    >
                      <FiEye className="w-4 h-4 mr-2" />
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {pagination.offset + 1} à {Math.min(pagination.offset + pagination.limit, pagination.total)} sur {pagination.total} résultats
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                disabled={pagination.offset === 0}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                disabled={!pagination.hasMore}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
