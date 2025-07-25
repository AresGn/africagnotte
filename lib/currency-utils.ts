/**
 * Utilitaires pour le formatage des devises - AfricaGnotte
 * Toutes les fonctions utilisent FCFA (XOF) comme devise principale
 */

/**
 * Formate un montant en FCFA avec le formatage français
 */
export function formatAmountFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formate un montant en FCFA sans le symbole de devise
 */
export function formatAmountPlain(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formate un montant avec le suffixe FCFA
 */
export function formatAmountWithSuffix(amount: number): string {
  return `${formatAmountPlain(amount)} FCFA`;
}

/**
 * Convertit un montant en texte pour l'affichage
 */
export function formatAmountForDisplay(amount: number, showCurrency: boolean = true): string {
  if (showCurrency) {
    return formatAmountFCFA(amount);
  }
  return formatAmountPlain(amount);
}

/**
 * Valide qu'un montant est valide pour FCFA
 */
export function isValidAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount) && amount <= 999999999; // Max 999M FCFA
}

/**
 * Convertit une chaîne en montant valide
 */
export function parseAmount(amountString: string): number | null {
  const cleaned = amountString.replace(/[^\d]/g, '');
  const amount = parseInt(cleaned, 10);
  
  if (isNaN(amount) || !isValidAmount(amount)) {
    return null;
  }
  
  return amount;
}

/**
 * Formate un pourcentage de progression
 */
export function formatProgress(current: number, target: number): string {
  if (target <= 0) return '0%';
  const percentage = Math.min((current / target) * 100, 100);
  return `${Math.round(percentage)}%`;
}

/**
 * Calcule le pourcentage de progression
 */
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
}

/**
 * Formate une date en français
 */
export function formatDateFR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formate une date avec l'heure en français
 */
export function formatDateTimeFR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Constantes pour les montants suggérés en FCFA
 */
export const SUGGESTED_AMOUNTS = {
  SMALL: [500, 1000, 2500, 5000],
  MEDIUM: [1000, 2500, 5000, 10000],
  LARGE: [5000, 10000, 25000, 50000],
  VERY_LARGE: [10000, 25000, 50000, 100000]
};

/**
 * Obtient les montants suggérés selon la catégorie de la cagnotte
 */
export function getSuggestedAmounts(category?: string): number[] {
  switch (category?.toLowerCase()) {
    case 'urgence':
    case 'santé':
      return SUGGESTED_AMOUNTS.LARGE;
    case 'éducation':
    case 'famille':
      return SUGGESTED_AMOUNTS.MEDIUM;
    case 'orphelins':
    case 'personnes âgées':
      return SUGGESTED_AMOUNTS.MEDIUM;
    default:
      return SUGGESTED_AMOUNTS.MEDIUM;
  }
}

/**
 * Formate un montant pour l'affichage dans les cartes de cagnotte
 */
export function formatCardAmount(current: number, target?: number): string {
  const currentFormatted = formatAmountFCFA(current);
  
  if (target && target > 0) {
    const targetFormatted = formatAmountFCFA(target);
    return `${currentFormatted} / ${targetFormatted}`;
  }
  
  return currentFormatted;
}

/**
 * Détermine la couleur de progression selon le pourcentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'text-green-600';
  if (percentage >= 75) return 'text-lime-600';
  if (percentage >= 50) return 'text-yellow-600';
  if (percentage >= 25) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Détermine la couleur de fond de progression selon le pourcentage
 */
export function getProgressBgColor(percentage: number): string {
  if (percentage >= 100) return 'bg-green-500';
  if (percentage >= 75) return 'bg-lime-500';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-orange-500';
  return 'bg-red-500';
}
