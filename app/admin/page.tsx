'use client';

import { useState, useEffect } from 'react';
import {
  FiFileText,
  FiUsers,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTrendingUp,
  FiDollarSign
} from 'react-icons/fi';
import SimpleChart from '../../components/admin/SimpleChart';

interface AdminStats {
  total_cagnottes: number;
  pending_cagnottes: number;
  approved_cagnottes: number;
  rejected_cagnottes: number;
  suspended_cagnottes: number;
  total_users: number;
  pending_reports: number;
  total_reports: number;
}

interface DailyStats {
  today: {
    new_cagnottes: number;
    new_users: number;
    moderations_done: number;
    reports_received: number;
    reports_resolved: number;
    total_amount_collected: number;
  };
  trends: {
    avg_new_cagnottes: number;
    avg_new_users: number;
    weekly_data: Array<{
      date: string;
      new_cagnottes: number;
      new_users: number;
      moderations_done: number;
      total_collected: number;
    }>;
  };
}

interface Activity {
  type: string;
  description: string;
  details: string;
  timestamp: string;
  user: string;
  icon: string;
  color: string;
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  urgent?: boolean;
  suffix?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchStats(),
      fetchDailyStats(),
      fetchActivities()
    ]);
  };

  const fetchStats = async () => {
    try {
      console.log('[AdminDashboard] Récupération des statistiques réelles...');

      const response = await fetch('/api/admin/stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API stats: ${response.status} ${response.statusText}`);
      }

      const realStats = await response.json();
      console.log('[AdminDashboard] Statistiques reçues:', realStats);

      setStats(realStats);
    } catch (err) {
      console.error('[AdminDashboard] Erreur lors de la récupération des stats:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des statistiques');
    }
  };

  const fetchDailyStats = async () => {
    try {
      console.log('[AdminDashboard] Récupération des statistiques quotidiennes...');

      const response = await fetch('/api/admin/daily-stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API daily-stats: ${response.status} ${response.statusText}`);
      }

      const dailyData = await response.json();
      console.log('[AdminDashboard] Statistiques quotidiennes reçues:', dailyData);

      setDailyStats(dailyData);
    } catch (err) {
      console.error('[AdminDashboard] Erreur lors de la récupération des stats quotidiennes:', err);
    }
  };

  const fetchActivities = async () => {
    try {
      console.log('[AdminDashboard] Récupération de l\'activité récente...');

      const response = await fetch('/api/admin/activity', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API activity: ${response.status} ${response.statusText}`);
      }

      const activityData = await response.json();
      console.log('[AdminDashboard] Activités reçues:', activityData);

      setActivities(activityData);
    } catch (err) {
      console.error('[AdminDashboard] Erreur lors de la récupération des activités:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <FiAlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <h3 className="text-red-800 font-medium">Erreur</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!stats) return null;

  // Organiser les statistiques par catégories
  const cagnotteStats = [
    {
      title: 'Total Cagnottes',
      value: stats.total_cagnottes,
      icon: FiFileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'En Attente',
      value: stats.pending_cagnottes,
      icon: FiClock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      urgent: stats.pending_cagnottes > 3
    },
    {
      title: 'Approuvées',
      value: stats.approved_cagnottes,
      icon: FiCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Rejetées',
      value: stats.rejected_cagnottes,
      icon: FiXCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const moderationStats = [
    {
      title: 'Signalements Actifs',
      value: stats.pending_reports,
      icon: FiAlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      urgent: stats.pending_reports > 2
    },
    {
      title: 'Total Signalements',
      value: stats.total_reports,
      icon: FiAlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-25'
    },
    {
      title: 'Taux d\'Approbation',
      value: Math.round((stats.approved_cagnottes / stats.total_cagnottes) * 100),
      icon: FiTrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      suffix: '%'
    }
  ];

  const userStats = [
    {
      title: 'Utilisateurs Actifs',
      value: stats.total_users,
      icon: FiUsers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Suspendues',
      value: stats.suspended_cagnottes,
      icon: FiDollarSign,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              🛡️ Dashboard Administrateur
            </h1>
            <p className="text-amber-100 mt-2">Vue d'ensemble et gestion de la plateforme AfriCagnotte</p>
          </div>
          <button
            onClick={fetchAllData}
            className="bg-white text-amber-600 px-4 py-2 rounded-md hover:bg-amber-50 flex items-center font-medium"
          >
            <FiTrendingUp className="h-4 w-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Stats Cards - Organisées par catégories */}
      <div className="space-y-8">
        {/* Statistiques des Cagnottes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiFileText className="h-5 w-5 mr-2 text-blue-600" />
            Gestion des Cagnottes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cagnotteStats.map((card, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
                card.urgent ? 'border-l-yellow-400 bg-yellow-50' : 'border-l-blue-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {card.value}{card.suffix || ''}
                      </p>
                      {card.change && (
                        <p className={`text-sm ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                          {card.change}
                        </p>
                      )}
                    </div>
                  </div>
                  {card.urgent && (
                    <div className="text-yellow-600">
                      <FiAlertTriangle className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques de Modération */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiAlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Modération & Signalements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moderationStats.map((card, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
                card.urgent ? 'border-l-red-400 bg-red-50' : 'border-l-orange-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {card.value}{card.suffix || ''}
                      </p>
                    </div>
                  </div>
                  {card.urgent && (
                    <div className="text-red-600">
                      <FiAlertTriangle className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques des Utilisateurs */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiUsers className="h-5 w-5 mr-2 text-purple-600" />
            Communauté & Utilisateurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userStats.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border-l-4 border-l-purple-400 p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value}{card.suffix || ''}
                    </p>
                    {card.change && (
                      <p className={`text-sm ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {card.change}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graphiques et Visualisations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des Cagnottes */}
        <SimpleChart
          title="Répartition des Cagnottes"
          type="donut"
          data={[
            { label: 'Approuvées', value: stats.approved_cagnottes, color: '#10B981' },
            { label: 'En Attente', value: stats.pending_cagnottes, color: '#F59E0B' },
            { label: 'Rejetées', value: stats.rejected_cagnottes, color: '#EF4444' },
            { label: 'Suspendues', value: stats.suspended_cagnottes, color: '#6B7280' }
          ]}
        />

        {/* Métriques de Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Métriques de Performance
          </h3>
          <div className="space-y-6">
            {/* Taux d'approbation */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Taux d'Approbation</span>
                <span className="text-sm font-bold text-green-600">
                  {Math.round((stats.approved_cagnottes / stats.total_cagnottes) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.approved_cagnottes / stats.total_cagnottes) * 100}%` }}
                />
              </div>
            </div>

            {/* Efficacité de modération */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Efficacité de Modération</span>
                <span className="text-sm font-bold text-blue-600">
                  {Math.round(((stats.approved_cagnottes + stats.rejected_cagnottes) / stats.total_cagnottes) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((stats.approved_cagnottes + stats.rejected_cagnottes) / stats.total_cagnottes) * 100}%` }}
                />
              </div>
            </div>

            {/* Charge de travail */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Charge de Travail</span>
                <span className={`text-sm font-bold ${stats.pending_cagnottes > 5 ? 'text-red-600' : stats.pending_cagnottes > 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {stats.pending_cagnottes > 5 ? 'Élevée' : stats.pending_cagnottes > 2 ? 'Modérée' : 'Faible'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    stats.pending_cagnottes > 5 ? 'bg-red-500' :
                    stats.pending_cagnottes > 2 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((stats.pending_cagnottes / 10) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Résumé rapide */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total_reports}</div>
                  <div className="text-xs text-gray-500">Signalements</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total_users}</div>
                  <div className="text-xs text-gray-500">Utilisateurs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Rapides & Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions Urgentes */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiAlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Actions Urgentes
          </h2>
          <div className="space-y-3">
            {stats.pending_cagnottes > 0 && (
              <a
                href="/admin/cagnottes?status=pending"
                className={`flex items-center justify-between p-4 rounded-lg border-l-4 transition-colors ${
                  stats.pending_cagnottes > 3
                    ? 'border-l-red-400 bg-red-50 hover:bg-red-100'
                    : 'border-l-yellow-400 bg-yellow-50 hover:bg-yellow-100'
                }`}
              >
                <div className="flex items-center">
                  <FiClock className={`h-5 w-5 mr-3 ${stats.pending_cagnottes > 3 ? 'text-red-600' : 'text-yellow-600'}`} />
                  <div>
                    <h3 className="font-medium text-gray-900">Cagnottes en attente</h3>
                    <p className="text-sm text-gray-600">Nécessitent une modération</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stats.pending_cagnottes > 3
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {stats.pending_cagnottes}
                </div>
              </a>
            )}

            {stats.pending_reports > 0 && (
              <a
                href="/admin/moderation"
                className={`flex items-center justify-between p-4 rounded-lg border-l-4 transition-colors ${
                  stats.pending_reports > 2
                    ? 'border-l-red-400 bg-red-50 hover:bg-red-100'
                    : 'border-l-orange-400 bg-orange-50 hover:bg-orange-100'
                }`}
              >
                <div className="flex items-center">
                  <FiAlertTriangle className={`h-5 w-5 mr-3 ${stats.pending_reports > 2 ? 'text-red-600' : 'text-orange-600'}`} />
                  <div>
                    <h3 className="font-medium text-gray-900">Signalements actifs</h3>
                    <p className="text-sm text-gray-600">Nécessitent une révision</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stats.pending_reports > 2
                    ? 'bg-red-100 text-red-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {stats.pending_reports}
                </div>
              </a>
            )}

            {stats.pending_cagnottes === 0 && stats.pending_reports === 0 && (
              <div className="flex items-center p-4 bg-green-50 rounded-lg border-l-4 border-l-green-400">
                <FiCheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-green-900">Tout est à jour !</h3>
                  <p className="text-sm text-green-700">Aucune action urgente requise</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Générales */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Gestion Générale
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <a
              href="/admin/cagnottes"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <FiFileText className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Toutes les Cagnottes</h3>
                  <p className="text-sm text-gray-600">Gérer et modérer</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </a>

            <a
              href="/admin/utilisateurs"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <FiUsers className="h-5 w-5 text-purple-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Utilisateurs</h3>
                  <p className="text-sm text-gray-600">{stats.total_users} membres</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </a>

            <a
              href="/admin/rapports"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <FiDollarSign className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Rapports & Analytics</h3>
                  <p className="text-sm text-gray-600">Statistiques détaillées</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Activité Récente & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed d'Activité */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiClock className="h-5 w-5 mr-2 text-gray-500" />
              Activité Récente
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">Voir tout</button>
          </div>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 4).map((activity, index) => {
                const IconComponent = getIconComponent(activity.icon);
                const colorClasses = getColorClasses(activity.color);
                const timeAgo = formatTimeAgo(activity.timestamp);

                return (
                  <div key={index} className={`flex items-start space-x-3 p-3 ${colorClasses.bg} rounded-lg border-l-4 ${colorClasses.border}`}>
                    <div className="flex-shrink-0">
                      <IconComponent className={`h-5 w-5 ${colorClasses.text} mt-0.5`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-400 mt-1">{timeAgo} • Par {activity.user}</p>
                    </div>
                  </div>
                );
              })}

              {activities.length === 0 && (
                <div className="text-center py-8">
                  <FiClock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune activité récente</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 bg-gray-200 rounded mt-0.5"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Résumé Quotidien */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
            Aujourd'hui
          </h3>
          {dailyStats ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nouvelles cagnottes</span>
                <span className="text-lg font-semibold text-gray-900">{dailyStats.today.new_cagnottes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Modérations effectuées</span>
                <span className="text-lg font-semibold text-gray-900">{dailyStats.today.moderations_done}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nouveaux utilisateurs</span>
                <span className="text-lg font-semibold text-gray-900">{dailyStats.today.new_users}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Signalements traités</span>
                <span className="text-lg font-semibold text-gray-900">{dailyStats.today.reports_resolved}</span>
              </div>
              <hr className="my-4" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Total collecté</span>
                <span className="text-lg font-bold text-green-600">
                  {new Intl.NumberFormat('fr-FR').format(dailyStats.today.total_amount_collected)} FCFA
                </span>
              </div>
              {dailyStats.trends.avg_new_cagnottes > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Moyenne 7 jours: {dailyStats.trends.avg_new_cagnottes} cagnottes/jour
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Fonctions utilitaires
function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'FiFileText':
      return FiFileText;
    case 'FiCheckCircle':
      return FiCheckCircle;
    case 'FiAlertTriangle':
      return FiAlertTriangle;
    case 'FiUsers':
      return FiUsers;
    case 'FiXCircle':
      return FiXCircle;
    default:
      return FiClock;
  }
}

function getColorClasses(color: string) {
  switch (color) {
    case 'green':
      return {
        bg: 'bg-green-50',
        border: 'border-l-green-400',
        text: 'text-green-600'
      };
    case 'yellow':
      return {
        bg: 'bg-yellow-50',
        border: 'border-l-yellow-400',
        text: 'text-yellow-600'
      };
    case 'blue':
      return {
        bg: 'bg-blue-50',
        border: 'border-l-blue-400',
        text: 'text-blue-600'
      };
    case 'red':
      return {
        bg: 'bg-red-50',
        border: 'border-l-red-400',
        text: 'text-red-600'
      };
    case 'purple':
      return {
        bg: 'bg-purple-50',
        border: 'border-l-purple-400',
        text: 'text-purple-600'
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-l-gray-400',
        text: 'text-gray-600'
      };
  }
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Il y a quelques secondes';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
}
