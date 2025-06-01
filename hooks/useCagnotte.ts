import { useState, useEffect } from 'react';
import { CagnotteDetailData } from '../components/CagnotteDetailView';

interface UseCagnotteResult {
  cagnotte: CagnotteDetailData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCagnotte(slugOrId: string): UseCagnotteResult {
  const [cagnotte, setCagnotte] = useState<CagnotteDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCagnotte = async () => {
    if (!slugOrId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/cagnottes/detail/${slugOrId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Cagnotte introuvable');
        }
        throw new Error('Erreur lors du chargement de la cagnotte');
      }

      const data = await response.json();
      
      // Transformer les données pour correspondre au format attendu
      const transformedData: CagnotteDetailData = {
        ...data,
        longDescription: data.longDescription || data.long_description,
        currentAmount: data.current_amount,
        targetAmount: data.target_amount,
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        participants: data.participants_count,
        isEnded: data.status === 'closed',
        // Transformer les donations pour correspondre au format attendu
        donations: (data.donations || []).map((donation: any) => ({
          ...donation,
          name: donation.donor_name,
          date: new Date(donation.created_at)
        })),
        // Transformer les actualités
        actualites: (data.actualites || []).map((actualite: any) => ({
          ...actualite,
          titre: actualite.title,
          contenu: actualite.content,
          date: new Date(actualite.created_at),
          video: actualite.video_url,
          montantCollecte: actualite.amount_at_time
        }))
      };

      setCagnotte(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setCagnotte(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCagnotte();
  }, [slugOrId]);

  return {
    cagnotte,
    loading,
    error,
    refetch: fetchCagnotte
  };
}

// Hook pour les dons
interface UseDonationsResult {
  donations: any[];
  loading: boolean;
  error: string | null;
  createDonation: (donationData: any) => Promise<boolean>;
}

export function useDonations(cagnotteId: string): UseDonationsResult {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async () => {
    if (!cagnotteId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/cagnottes/${cagnotteId}/donations?limit=20`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des dons');
      }

      const data = await response.json();
      setDonations(data.donations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createDonation = async (donationData: any): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/cagnottes/${cagnotteId}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du don');
      }

      // Recharger les dons après création
      await fetchDonations();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [cagnotteId]);

  return {
    donations,
    loading,
    error,
    createDonation
  };
}

// Hook pour les actualités
interface UseActualitesResult {
  actualites: any[];
  loading: boolean;
  error: string | null;
  createActualite: (actualiteData: any) => Promise<boolean>;
}

export function useActualites(cagnotteId: string, userId?: string): UseActualitesResult {
  const [actualites, setActualites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActualites = async () => {
    if (!cagnotteId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/cagnottes/${cagnotteId}/actualites`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des actualités');
      }

      const data = await response.json();
      setActualites(data.actualites || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createActualite = async (actualiteData: any): Promise<boolean> => {
    if (!userId) {
      setError('Authentification requise');
      return false;
    }

    try {
      setError(null);

      const response = await fetch(`/api/cagnottes/${cagnotteId}/actualites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify(actualiteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de l\'actualité');
      }

      // Recharger les actualités après création
      await fetchActualites();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    }
  };

  useEffect(() => {
    fetchActualites();
  }, [cagnotteId]);

  return {
    actualites,
    loading,
    error,
    createActualite
  };
}

// Hook pour les statistiques
interface UseStatsResult {
  stats: any;
  loading: boolean;
  error: string | null;
}

export function useStats(cagnotteId: string, userId?: string): UseStatsResult {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!cagnotteId) return;

    try {
      setLoading(true);
      setError(null);

      const headers: Record<string, string> = {};
      if (userId) {
        headers['x-user-id'] = userId;
      }

      const response = await fetch(`/api/cagnottes/${cagnotteId}/stats`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [cagnotteId, userId]);

  return {
    stats,
    loading,
    error
  };
}
