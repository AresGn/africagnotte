'use client';

import { useState, useEffect } from 'react';
import { 
  FiShield, 
  FiAlertTriangle, 
  FiSearch, 
  FiFilter,
  FiEye,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiFileText,
  FiRefreshCw
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface Report {
  id: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
  reviewed_at?: string;
  cagnotte_id: string;
  cagnotte_title: string;
  cagnotte_status: string;
  reporter_id: string;
  reporter_username: string;
  reporter_first_name?: string;
  reporter_last_name?: string;
  reviewer_id?: string;
  reviewer_username?: string;
  reviewer_first_name?: string;
  reviewer_last_name?: string;
}

interface ReportStats {
  total_reports: number;
  pending_reports: number;
  reviewed_reports: number;
  resolved_reports: number;
  fraud_reports: number;
  inappropriate_reports: number;
  spam_reports: number;
  other_reports: number;
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionNotes, setActionNotes] = useState('');

  const statusConfig = {
    pending: { 
      label: 'En attente', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-100',
      icon: FiClock
    },
    reviewed: { 
      label: 'Examiné', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      icon: FiEye
    },
    resolved: { 
      label: 'Résolu', 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      icon: FiCheck
    }
  };

  const reasonConfig = {
    fraud: { label: 'Fraude', color: 'text-red-600' },
    inappropriate: { label: 'Contenu inapproprié', color: 'text-orange-600' },
    spam: { label: 'Spam', color: 'text-purple-600' },
    other: { label: 'Autre', color: 'text-gray-600' }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedStatus, selectedReason, searchTerm, pagination.offset]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedStatus) params.append('status', selectedStatus);
      if (selectedReason) params.append('reason', selectedReason);
      if (searchTerm) params.append('search', searchTerm);
      params.append('limit', pagination.limit.toString());
      params.append('offset', pagination.offset.toString());

      const response = await fetch(`/api/admin/reports?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des signalements');
      }

      const data = await response.json();
      setReports(data.reports);
      setPagination(data.pagination);
      setStats(data.stats);

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des signalements');
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          status, 
          notes: actionNotes 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du traitement');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Recharger les données
      fetchReports();
      setShowModal(false);
      setSelectedReport(null);
      setActionNotes('');

    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors du traitement');
    }
  };

  const openActionModal = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
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

  const getReporterName = (report: Report) => {
    if (report.reporter_first_name && report.reporter_last_name) {
      return `${report.reporter_first_name} ${report.reporter_last_name}`;
    }
    return report.reporter_username || 'Utilisateur anonyme';
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

      {/* Liste des signalements */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Signalements ({pagination.total})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Chargement...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center">
              <FiAlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun signalement trouvé</p>
            </div>
          ) : (
            reports.map((report) => {
              const statusInfo = statusConfig[report.status as keyof typeof statusConfig];
              const reasonInfo = reasonConfig[report.reason as keyof typeof reasonConfig];

              return (
                <div key={report.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                          <statusInfo.icon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </span>
                        <span className={`text-sm font-medium ${reasonInfo.color}`}>
                          {reasonInfo.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(report.created_at)}
                        </span>
                      </div>

                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Cagnotte: {report.cagnotte_title}
                      </h3>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {report.description}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <FiUser className="h-4 w-4 mr-1" />
                          Signalé par: {getReporterName(report)}
                        </span>
                        {report.reviewer_username && (
                          <span className="flex items-center">
                            <FiEye className="h-4 w-4 mr-1" />
                            Traité par: {report.reviewer_username}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <a
                        href={`/c/${report.cagnotte_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FiEye className="h-4 w-4 mr-1" />
                        Voir
                      </a>

                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openActionModal(report)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <FiEye className="h-4 w-4 mr-1" />
                            Examiner
                          </button>
                          <button
                            onClick={() => openActionModal(report)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <FiCheck className="h-4 w-4 mr-1" />
                            Résoudre
                          </button>
                        </>
                      )}

                      {report.status === 'reviewed' && (
                        <button
                          onClick={() => openActionModal(report)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <FiCheck className="h-4 w-4 mr-1" />
                          Résoudre
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {pagination.offset + 1} à {Math.min(pagination.offset + pagination.limit, pagination.total)} sur {pagination.total} signalements
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                disabled={pagination.offset === 0}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                disabled={!pagination.hasMore}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'action */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Traiter le signalement
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Cagnotte:</strong> {selectedReport.cagnotte_title}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Raison:</strong> {reasonConfig[selectedReport.reason as keyof typeof reasonConfig].label}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Description:</strong> {selectedReport.description}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ajoutez des notes sur votre décision..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleReportAction(selectedReport.id, 'reviewed')}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <FiEye className="h-4 w-4 mr-2" />
                Marquer comme examiné
              </button>
              <button
                onClick={() => handleReportAction(selectedReport.id, 'resolved')}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
              >
                <FiCheck className="h-4 w-4 mr-2" />
                Marquer comme résolu
              </button>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                setSelectedReport(null);
                setActionNotes('');
              }}
              className="w-full mt-3 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
          
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
