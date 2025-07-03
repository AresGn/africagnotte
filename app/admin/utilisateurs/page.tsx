'use client';

import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter,
  FiEye,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiMail,
  FiPhone,
  FiCalendar,
  FiRefreshCw,
  FiSettings
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  cagnottes_count: number;
  total_raised: number;
}

interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  regular_users: number;
  moderators: number;
  admins: number;
  super_admins: number;
  new_users_week: number;
  new_users_month: number;
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  });
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'activate' | 'deactivate' | 'change_role'>('activate');
  const [newRole, setNewRole] = useState('');

  const roleConfig = {
    user: { label: 'Utilisateur', color: 'text-gray-600', bgColor: 'bg-gray-100' },
    moderator: { label: 'Modérateur', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    admin: { label: 'Administrateur', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    super_admin: { label: 'Super Admin', color: 'text-red-600', bgColor: 'bg-red-100' }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole, selectedStatus, searchTerm, pagination.offset]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedRole) params.append('role', selectedRole);
      if (selectedStatus) params.append('status', selectedStatus);
      if (searchTerm) params.append('search', searchTerm);
      params.append('limit', pagination.limit.toString());
      params.append('offset', pagination.offset.toString());

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
      setStats(data.stats);

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string, role?: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          action, 
          role: role || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'action');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Recharger les données
      fetchUsers();
      setShowModal(false);
      setSelectedUser(null);

    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'action');
    }
  };

  const openActionModal = (user: User, action: 'activate' | 'deactivate' | 'change_role') => {
    setSelectedUser(user);
    setActionType(action);
    setNewRole(user.role);
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

  const getUserName = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold flex items-center">
          <FiUsers className="mr-3" />
          Gestion des Utilisateurs
        </h1>
        <p className="text-purple-100 mt-2">Administration et modération des comptes utilisateurs</p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
              </div>
              <FiUsers className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.active_users}</p>
              </div>
              <FiUserCheck className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cette semaine</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new_users_week}</p>
              </div>
              <FiCalendar className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins + stats.super_admins}</p>
              </div>
              <FiShield className="h-8 w-8 text-purple-400" />
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
              placeholder="Nom, email, téléphone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFilter className="inline h-4 w-4 mr-1" />
              Rôle
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tous les rôles</option>
              <option value="user">Utilisateur</option>
              <option value="moderator">Modérateur</option>
              <option value="admin">Administrateur</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchUsers}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center"
            >
              <FiRefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Utilisateurs ({pagination.total})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Chargement...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            users.map((user) => {
              const roleInfo = roleConfig[user.role as keyof typeof roleConfig];

              return (
                <div key={user.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {getUserName(user)}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.bgColor} ${roleInfo.color}`}>
                          <FiShield className="h-3 w-3 mr-1" />
                          {roleInfo.label}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {user.is_active ? (
                            <>
                              <FiUserCheck className="h-3 w-3 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <FiUserX className="h-3 w-3 mr-1" />
                              Inactif
                            </>
                          )}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 flex items-center">
                            <FiMail className="h-4 w-4 mr-2" />
                            {user.email}
                          </p>
                          {user.phone_number && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <FiPhone className="h-4 w-4 mr-2" />
                              {user.phone_number}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <strong>Cagnottes:</strong> {user.cagnottes_count}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Total collecté:</strong> {formatAmount(user.total_raised)}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 flex items-center">
                        <FiCalendar className="h-4 w-4 mr-1" />
                        Inscrit le {formatDate(user.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {/* TODO: Voir détails */}}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FiEye className="h-4 w-4 mr-1" />
                        Voir
                      </button>

                      {user.is_active ? (
                        <button
                          onClick={() => openActionModal(user, 'deactivate')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <FiUserX className="h-4 w-4 mr-1" />
                          Désactiver
                        </button>
                      ) : (
                        <button
                          onClick={() => openActionModal(user, 'activate')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <FiUserCheck className="h-4 w-4 mr-1" />
                          Activer
                        </button>
                      )}

                      <button
                        onClick={() => openActionModal(user, 'change_role')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        <FiSettings className="h-4 w-4 mr-1" />
                        Rôle
                      </button>
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
              Affichage de {pagination.offset + 1} à {Math.min(pagination.offset + pagination.limit, pagination.total)} sur {pagination.total} utilisateurs
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
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {actionType === 'activate' && 'Activer l\'utilisateur'}
              {actionType === 'deactivate' && 'Désactiver l\'utilisateur'}
              {actionType === 'change_role' && 'Modifier le rôle'}
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Utilisateur:</strong> {getUserName(selectedUser)}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Rôle actuel:</strong> {roleConfig[selectedUser.role as keyof typeof roleConfig].label}
              </p>
            </div>

            {actionType === 'change_role' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau rôle
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="user">Utilisateur</option>
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Administrateur</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (actionType === 'change_role') {
                    handleUserAction(selectedUser.id, actionType, newRole);
                  } else {
                    handleUserAction(selectedUser.id, actionType);
                  }
                }}
                className={`flex-1 px-4 py-2 rounded-md text-white font-medium ${
                  actionType === 'activate'
                    ? 'bg-green-600 hover:bg-green-700'
                    : actionType === 'deactivate'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Confirmer
              </button>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                setSelectedUser(null);
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
