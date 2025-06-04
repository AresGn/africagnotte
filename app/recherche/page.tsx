'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaFilter, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// Utilisation des mêmes catégories que sur la page d'accueil
const categories = [
  { name: 'Santé', emoji: '🏥' },
  { name: 'Famille', emoji: '👪' },
  { name: 'Orphelins', emoji: '👶' },
  { name: 'Urgences', emoji: '🚨' }
];

// Interface pour les cagnottes
interface Cagnotte {
  id: string;
  title: string;
  custom_url: string | null;
  category: string;
  description: string;
  images: string[];
  current_amount: number;
  target_amount: number | null;
  participants_count: number;
  author_name: string | null;
  created_at: string;
}

export default function RechercheCagnotte() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [allCagnottes, setAllCagnottes] = useState<Cagnotte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 4;

  // Charger toutes les cagnottes publiques au montage du composant
  useEffect(() => {
    async function fetchCagnottes() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/cagnottes/public');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Impossible de charger les cagnottes');
        }

        const data: Cagnotte[] = await response.json();
        setAllCagnottes(data);

      } catch (err) {
        console.error('Erreur lors du chargement des cagnottes:', err);
        setError((err as Error).message || 'Impossible de charger les cagnottes');
        toast.error((err as Error).message || 'Erreur lors du chargement des cagnottes');
      } finally {
        setLoading(false);
      }
    }

    fetchCagnottes();
  }, []);

  // Filtrage des cagnottes en fonction des critères de recherche
  const filteredCagnottes = allCagnottes.filter(cagnotte => {
    const matchesSearch = cagnotte.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cagnotte.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (cagnotte.author_name && cagnotte.author_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategories.length === 0 ||
                          selectedCategories.includes(cagnotte.category);

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCagnottes.length / itemsPerPage);
  const displayedCagnottes = filteredCagnottes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Formatage des dates et montants
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    });
  };

  // Gestion des filtres par catégorie
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    setCurrentPage(1); // Réinitialiser la pagination lors du changement de filtre
  };

  // Gestionnaire de recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Réinitialiser la pagination lors d'une nouvelle recherche
  };

  return (
    <main className="py-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10">Rechercher une cagnotte</h1>

        {/* Barre de recherche */}
        <div className="mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 sm:gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher une cagnotte, une cause, un créateur..."
                className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-base sm:text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-xl" />
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white p-3 sm:p-4 rounded-lg shadow-md min-w-fit md:w-36 flex items-center justify-center gap-2 text-base sm:text-lg transition-colors"
            >
              <FaSearch /> Rechercher
            </button>
            <button
              type="button"
              className="md:hidden bg-gray-200 hover:bg-gray-300 p-3 sm:p-4 rounded-lg shadow-md flex items-center justify-center gap-2 text-base sm:text-lg transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filtres
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtres par catégorie - version desktop */}
          <div className="hidden md:block">
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaFilter /> Filtrer par catégorie
              </h2>
              <div className="space-y-3">
                {categories.map(category => (
                  <div key={category.name} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.name}`}
                      className="w-5 h-5 mr-3 text-amber-500 focus:ring-amber-500"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => toggleCategory(category.name)}
                    />
                    <label htmlFor={`category-${category.name}`} className="flex items-center gap-2">
                      <span>{category.emoji}</span> {category.name}
                    </label>
                  </div>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <button
                  className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                  onClick={() => setSelectedCategories([])}
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>

          {/* Filtres par catégorie - version mobile */}
          {showFilters && (
            <div className="md:hidden bg-white rounded-lg shadow-md p-5 mb-6 col-span-full">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaFilter /> Filtrer par catégorie
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <div key={category.name} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-mobile-${category.name}`}
                      className="w-5 h-5 mr-3 text-amber-500 focus:ring-amber-500"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => toggleCategory(category.name)}
                    />
                    <label htmlFor={`category-mobile-${category.name}`} className="flex items-center gap-2">
                      <span>{category.emoji}</span> {category.name}
                    </label>
                  </div>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <button
                  className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                  onClick={() => setSelectedCategories([])}
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

          {/* Liste des cagnottes */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Chargement...</h3>
                <p className="text-gray-600">Récupération des cagnottes en cours...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-red-600">Erreur</h3>
                <p className="text-gray-600 mb-3 sm:mb-4">{error}</p>
                <button
                  className="text-amber-600 hover:text-amber-700 font-medium"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </button>
              </div>
            ) : displayedCagnottes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Aucune cagnotte trouvée</h3>
                <p className="text-gray-600 mb-3 sm:mb-4">Essayez d&apos;autres termes de recherche ou de modifier vos filtres.</p>
                {selectedCategories.length > 0 && (
                  <button
                    className="text-amber-600 hover:text-amber-700 font-medium"
                    onClick={() => setSelectedCategories([])}
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {displayedCagnottes.map(cagnotte => (
                  <div key={cagnotte.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="relative h-48 sm:h-60 md:h-full">
                        <Image
                          src={cagnotte.images[0] || '/images/default-campaign.jpg'}
                          alt={cagnotte.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="p-3 sm:p-5 md:col-span-2">
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                          <div>
                            <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">{cagnotte.title}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                              Par <span className="font-medium">{cagnotte.author_name || 'Anonyme'}</span>
                            </p>
                          </div>
                          <span className="inline-block px-2 sm:px-3 py-1 bg-amber-100 text-amber-800 text-xs sm:text-sm font-medium rounded-full">
                            {cagnotte.category}
                          </span>
                        </div>

                        <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">{cagnotte.description}</p>

                        <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                          <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
                                <FaCalendarAlt className="text-gray-400" /> Créée le
                              </p>
                              <p className="text-sm sm:text-base font-medium">{formatDate(cagnotte.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
                                <FaUsers className="text-gray-400" /> Participants
                              </p>
                              <p className="text-sm sm:text-base font-medium">{cagnotte.participants_count} personnes</p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                              <span className="font-medium">{formatAmount(cagnotte.current_amount)}</span>
                              <span className="text-gray-600">Objectif: {formatAmount(cagnotte.target_amount || 0)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                              <div
                                className="bg-amber-500 h-2 sm:h-2.5 rounded-full"
                                style={{ width: `${Math.min(100, cagnotte.target_amount ? (cagnotte.current_amount / cagnotte.target_amount) * 100 : 0)}%` }}
                              ></div>
                            </div>
                          </div>

                          <Link
                            href={cagnotte.custom_url ? `/c/${cagnotte.custom_url}` : `/c/${cagnotte.id}`}
                            className="block text-center w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium transition-colors text-sm sm:text-base"
                          >
                            Voir la cagnotte
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2 sm:px-3 py-1 sm:py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        Précédent
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-sm sm:text-base ${
                            currentPage === page
                              ? 'bg-amber-500 text-white font-medium border border-amber-500'
                              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2 sm:px-3 py-1 sm:py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        Suivant
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}