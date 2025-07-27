// Service pour gérer les modes de paiement spécifiques à chaque pays
// AfricaGnotte - Système de paiement personnalisé

export interface PaymentOperator {
  id: string;
  name: string;
  field: string; // Nom du champ dans la base de données
  icon: string;
  color: string;
  required?: boolean;
}

export interface CountryPaymentConfig {
  country: string;
  countryCode: string;
  currency: string;
  operators: PaymentOperator[];
}

// Configuration des opérateurs par pays
export const COUNTRY_PAYMENT_CONFIGS: CountryPaymentConfig[] = [
  // ZONE XOF (Franc CFA Ouest-Africain)
  {
    country: 'Bénin',
    countryCode: 'BJ',
    currency: 'XOF',
    operators: [
      { id: 'moov', name: 'Moov Money', field: 'numero_moov', icon: '🟠', color: 'orange', required: true },
      { id: 'mtn', name: 'MTN Mobile Money', field: 'numero_mtn', icon: '🟡', color: 'yellow', required: true },
    ]
  },
  {
    country: 'Côte d\'Ivoire',
    countryCode: 'CI',
    currency: 'XOF',
    operators: [
      { id: 'moov', name: 'Moov Money', field: 'numero_moov', icon: '🟠', color: 'orange', required: true },
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
      { id: 'wave', name: 'Wave', field: 'numero_wave', icon: '🔵', color: 'blue' },
    ]
  },
  {
    country: 'Burkina Faso',
    countryCode: 'BF',
    currency: 'XOF',
    operators: [
      { id: 'moov', name: 'Moov Money', field: 'numero_moov', icon: '🟠', color: 'orange', required: true },
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
    ]
  },
  {
    country: 'Mali',
    countryCode: 'ML',
    currency: 'XOF',
    operators: [
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
      { id: 'moov', name: 'Moov Money', field: 'numero_moov', icon: '🟠', color: 'orange' },
    ]
  },
  {
    country: 'Sénégal',
    countryCode: 'SN',
    currency: 'XOF',
    operators: [
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
      { id: 'wave', name: 'Wave', field: 'numero_wave', icon: '🔵', color: 'blue', required: true },
      { id: 'autres', name: 'Free Money', field: 'numero_autres', icon: '🔵', color: 'blue' },
    ]
  },
  {
    country: 'Togo',
    countryCode: 'TG',
    currency: 'XOF',
    operators: [
      { id: 'moov', name: 'Moov Money', field: 'numero_moov', icon: '🟠', color: 'orange', required: true },
      { id: 'autres', name: 'Togocel Money', field: 'numero_autres', icon: '🟢', color: 'green' },
    ]
  },
  {
    country: 'Niger',
    countryCode: 'NE',
    currency: 'XOF',
    operators: [
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red' },
    ]
  },
  {
    country: 'Guinée-Bissau',
    countryCode: 'GW',
    currency: 'XOF',
    operators: [
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
      { id: 'mtn', name: 'MTN Mobile Money', field: 'numero_mtn', icon: '🟡', color: 'yellow' },
    ]
  },

  // ZONE XAF (Franc CFA Centrafricain)
  {
    country: 'Cameroun',
    countryCode: 'CM',
    currency: 'XAF',
    operators: [
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
      { id: 'mtn', name: 'MTN Mobile Money', field: 'numero_mtn', icon: '🟡', color: 'yellow', required: true },
    ]
  },
  {
    country: 'Gabon',
    countryCode: 'GA',
    currency: 'XAF',
    operators: [
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red', required: true },
      { id: 'autres', name: 'Libertis Money', field: 'numero_autres', icon: '🟢', color: 'green' },
    ]
  },
  {
    country: 'République du Congo',
    countryCode: 'CG',
    currency: 'XAF',
    operators: [
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red', required: true },
      { id: 'mtn', name: 'MTN Mobile Money', field: 'numero_mtn', icon: '🟡', color: 'yellow' },
    ]
  },
  {
    country: 'République centrafricaine',
    countryCode: 'CF',
    currency: 'XAF',
    operators: [
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
      { id: 'autres', name: 'Telecel Money', field: 'numero_autres', icon: '🟢', color: 'green' },
    ]
  },
  {
    country: 'Tchad',
    countryCode: 'TD',
    currency: 'XAF',
    operators: [
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red', required: true },
      { id: 'autres', name: 'Tigo Money', field: 'numero_autres', icon: '🔵', color: 'blue' },
    ]
  },
  {
    country: 'Guinée équatoriale',
    countryCode: 'GQ',
    currency: 'XAF',
    operators: [
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
      { id: 'autres', name: 'HiTs Money', field: 'numero_autres', icon: '🟢', color: 'green' },
    ]
  },

  // AUTRES PAYS AFRICAINS
  {
    country: 'République démocratique du Congo',
    countryCode: 'CD',
    currency: 'CDF',
    operators: [
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red', required: true },
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
      { id: 'autres', name: 'Vodacom M-Pesa', field: 'numero_autres', icon: '🔴', color: 'red' },
    ]
  },
  {
    country: 'Kenya',
    countryCode: 'KE',
    currency: 'KES',
    operators: [
      { id: 'autres', name: 'M-Pesa', field: 'numero_autres', icon: '💚', color: 'green', required: true },
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red' },
    ]
  },
  {
    country: 'Ghana',
    countryCode: 'GH',
    currency: 'GHS',
    operators: [
      { id: 'mtn', name: 'MTN Mobile Money', field: 'numero_mtn', icon: '🟡', color: 'yellow', required: true },
      { id: 'autres', name: 'Tigo Cash', field: 'numero_autres', icon: '🔵', color: 'blue' },
    ]
  },
  {
    country: 'Ouganda',
    countryCode: 'UG',
    currency: 'UGX',
    operators: [
      { id: 'mtn', name: 'MTN Mobile Money', field: 'numero_mtn', icon: '🟡', color: 'yellow', required: true },
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red' },
    ]
  },
  {
    country: 'Rwanda',
    countryCode: 'RW',
    currency: 'RWF',
    operators: [
      { id: 'mtn', name: 'MTN Mobile Money', field: 'numero_mtn', icon: '🟡', color: 'yellow', required: true },
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red' },
    ]
  },
  {
    country: 'Tanzanie',
    countryCode: 'TZ',
    currency: 'TZS',
    operators: [
      { id: 'autres', name: 'Tigo Pesa', field: 'numero_autres', icon: '🔵', color: 'blue', required: true },
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red' },
    ]
  },
  {
    country: 'Zambie',
    countryCode: 'ZM',
    currency: 'ZMW',
    operators: [
      { id: 'mtn', name: 'MTN Mobile Money', field: 'numero_mtn', icon: '🟡', color: 'yellow', required: true },
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red' },
    ]
  },
  {
    country: 'Madagascar',
    countryCode: 'MG',
    currency: 'MGA',
    operators: [
      { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange', required: true },
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red' },
    ]
  },
  {
    country: 'Malawi',
    countryCode: 'MW',
    currency: 'MWK',
    operators: [
      { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red', required: true },
      { id: 'autres', name: 'TNM Mpamba', field: 'numero_autres', icon: '🟢', color: 'green' },
    ]
  }
];

/**
 * Obtient la configuration de paiement pour un pays donné
 */
export function getPaymentConfigForCountry(country: string): CountryPaymentConfig | null {
  return COUNTRY_PAYMENT_CONFIGS.find(config => 
    config.country.toLowerCase() === country.toLowerCase()
  ) || null;
}

/**
 * Obtient les opérateurs requis pour un pays
 */
export function getRequiredOperatorsForCountry(country: string): PaymentOperator[] {
  const config = getPaymentConfigForCountry(country);
  return config ? config.operators.filter(op => op.required) : [];
}

/**
 * Obtient tous les opérateurs disponibles pour un pays
 */
export function getAvailableOperatorsForCountry(country: string): PaymentOperator[] {
  const config = getPaymentConfigForCountry(country);
  return config ? config.operators : [];
}

/**
 * Vérifie si au moins un numéro requis est renseigné pour un pays
 */
export function validateRequiredPaymentNumbers(country: string, paymentData: Record<string, string>): {
  isValid: boolean;
  missingOperators: PaymentOperator[];
} {
  const requiredOperators = getRequiredOperatorsForCountry(country);
  const missingOperators = requiredOperators.filter(operator => 
    !paymentData[operator.field] || !paymentData[operator.field].trim()
  );
  
  return {
    isValid: missingOperators.length === 0,
    missingOperators
  };
}

/**
 * Obtient la liste de tous les pays supportés
 */
export function getSupportedCountries(): string[] {
  return COUNTRY_PAYMENT_CONFIGS.map(config => config.country).sort();
}

/**
 * Obtient la devise pour un pays donné
 */
export function getCurrencyForCountry(country: string): string {
  const config = getPaymentConfigForCountry(country);
  return config ? config.currency : 'XOF'; // Par défaut XOF
}
