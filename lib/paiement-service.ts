// SERVICE DE PAIEMENT PERSONNALISÉ AFRICAGNOTTE
// Gestion des codes USSD pour les opérateurs mobiles africains

export interface OperateurMobile {
  id: string;
  nom: string;
  icone: string;
  pays: string[];
  description: string;
  couleur: string;
}

export interface CodeUSSDGenere {
  code: string;
  instruction: string;
  exemple: string;
  message: string;
  operateur: string;
  beneficiaire: string;
  montant: number;
}

// Codes USSD directs pour les opérateurs mobiles africains
const CODES_USSD_DIRECTS = {
  // ===== MOOV MONEY =====
  "moov_benin": "*855*1*1*1*{beneficiaire}*{beneficiaire}*{montant}*VOTRE_CODE#",
  "moov_burkina": "*555*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "moov_togo": "*555*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "moov_ci": "*555*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  
  // ===== MTN MOBILE MONEY =====
  "mtn_benin": "*880*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "mtn_cameroun": "*126*1*5*{beneficiaire}*{montant}*VOTRE_CODE#",
  "mtn_congo": "*105*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "mtn_ci": "*133*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "mtn_ghana": "*170*{beneficiaire}*{montant}*VOTRE_CODE#",
  "mtn_uganda": "*165*{beneficiaire}*{montant}*VOTRE_CODE#",
  "mtn_rwanda": "*182*8*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "mtn_zambia": "*303*2*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  
  // ===== ORANGE MONEY =====
  "orange_senegal": "#144*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "orange_mali": "#144*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "orange_ci": "#144*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "orange_cameroun": "#150*50*{beneficiaire}*{montant}*VOTRE_CODE#",
  "orange_burkina": "#144*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "orange_niger": "#144*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "orange_madagascar": "#111*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  
  // ===== AIRTEL MONEY =====
  "airtel_niger": "*436*1*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "airtel_madagascar": "*436*2*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "airtel_kenya": "*334*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "airtel_tanzania": "*150*60*{beneficiaire}*{montant}*VOTRE_CODE#",
  "airtel_uganda": "*185*{beneficiaire}*{montant}*VOTRE_CODE#",
  "airtel_rwanda": "*182*2*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "airtel_zambia": "*200*2*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "airtel_malawi": "*211*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  
  // ===== AUTRES OPÉRATEURS =====
  "mpesa_kenya": "*334*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "free_senegal": "#150*{beneficiaire}*{montant}*VOTRE_CODE#",
  "expresso_senegal": "*333*{montant}*{beneficiaire}*VOTRE_CODE#",
  "tigo_tanzania": "*150*01*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "tigo_ghana": "*110*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "tigo_rwanda": "*182*3*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "vodacom_tanzania": "*150*00*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "vodacom_drc": "*111*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "wave_senegal": "*144*2*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "wave_ci": "*144*2*1*{beneficiaire}*{montant}*VOTRE_CODE#"
};

// Liste des opérateurs mobiles disponibles
export const OPERATEURS_MOBILES: OperateurMobile[] = [
  // MOOV MONEY
  { id: 'moov_benin', nom: 'Moov Money Bénin', icone: '🟠', pays: ['BJ'], description: 'Bénin', couleur: 'orange' },
  { id: 'moov_burkina', nom: 'Moov Money Burkina', icone: '🟠', pays: ['BF'], description: 'Burkina Faso', couleur: 'orange' },
  { id: 'moov_togo', nom: 'Moov Money Togo', icone: '🟠', pays: ['TG'], description: 'Togo', couleur: 'orange' },
  { id: 'moov_ci', nom: 'Moov Money Côte d\'Ivoire', icone: '🟠', pays: ['CI'], description: 'Côte d\'Ivoire', couleur: 'orange' },
  
  // MTN MOBILE MONEY
  { id: 'mtn_benin', nom: 'MTN Mobile Money Bénin', icone: '🟡', pays: ['BJ'], description: 'Bénin', couleur: 'yellow' },
  { id: 'mtn_cameroun', nom: 'MTN Mobile Money Cameroun', icone: '🟡', pays: ['CM'], description: 'Cameroun', couleur: 'yellow' },
  { id: 'mtn_congo', nom: 'MTN Mobile Money Congo', icone: '🟡', pays: ['CG'], description: 'Congo', couleur: 'yellow' },
  { id: 'mtn_ci', nom: 'MTN Mobile Money Côte d\'Ivoire', icone: '🟡', pays: ['CI'], description: 'Côte d\'Ivoire', couleur: 'yellow' },
  { id: 'mtn_ghana', nom: 'MTN Mobile Money Ghana', icone: '🟡', pays: ['GH'], description: 'Ghana', couleur: 'yellow' },
  { id: 'mtn_uganda', nom: 'MTN Mobile Money Ouganda', icone: '🟡', pays: ['UG'], description: 'Ouganda', couleur: 'yellow' },
  { id: 'mtn_rwanda', nom: 'MTN Mobile Money Rwanda', icone: '🟡', pays: ['RW'], description: 'Rwanda', couleur: 'yellow' },
  { id: 'mtn_zambia', nom: 'MTN Mobile Money Zambie', icone: '🟡', pays: ['ZM'], description: 'Zambie', couleur: 'yellow' },
  
  // ORANGE MONEY
  { id: 'orange_senegal', nom: 'Orange Money Sénégal', icone: '🟠', pays: ['SN'], description: 'Sénégal', couleur: 'orange' },
  { id: 'orange_mali', nom: 'Orange Money Mali', icone: '🟠', pays: ['ML'], description: 'Mali', couleur: 'orange' },
  { id: 'orange_ci', nom: 'Orange Money Côte d\'Ivoire', icone: '🟠', pays: ['CI'], description: 'Côte d\'Ivoire', couleur: 'orange' },
  { id: 'orange_cameroun', nom: 'Orange Money Cameroun', icone: '🟠', pays: ['CM'], description: 'Cameroun', couleur: 'orange' },
  { id: 'orange_burkina', nom: 'Orange Money Burkina', icone: '🟠', pays: ['BF'], description: 'Burkina Faso', couleur: 'orange' },
  { id: 'orange_niger', nom: 'Orange Money Niger', icone: '🟠', pays: ['NE'], description: 'Niger', couleur: 'orange' },
  { id: 'orange_madagascar', nom: 'Orange Money Madagascar', icone: '🟠', pays: ['MG'], description: 'Madagascar', couleur: 'orange' },
  
  // AIRTEL MONEY
  { id: 'airtel_niger', nom: 'Airtel Money Niger', icone: '🔴', pays: ['NE'], description: 'Niger', couleur: 'red' },
  { id: 'airtel_madagascar', nom: 'Airtel Money Madagascar', icone: '🔴', pays: ['MG'], description: 'Madagascar', couleur: 'red' },
  { id: 'airtel_kenya', nom: 'Airtel Money Kenya', icone: '🔴', pays: ['KE'], description: 'Kenya', couleur: 'red' },
  { id: 'airtel_tanzania', nom: 'Airtel Money Tanzanie', icone: '🔴', pays: ['TZ'], description: 'Tanzanie', couleur: 'red' },
  { id: 'airtel_uganda', nom: 'Airtel Money Ouganda', icone: '🔴', pays: ['UG'], description: 'Ouganda', couleur: 'red' },
  { id: 'airtel_rwanda', nom: 'Airtel Money Rwanda', icone: '🔴', pays: ['RW'], description: 'Rwanda', couleur: 'red' },
  { id: 'airtel_zambia', nom: 'Airtel Money Zambie', icone: '🔴', pays: ['ZM'], description: 'Zambie', couleur: 'red' },
  { id: 'airtel_malawi', nom: 'Airtel Money Malawi', icone: '🔴', pays: ['MW'], description: 'Malawi', couleur: 'red' },
  
  // AUTRES OPÉRATEURS
  { id: 'mpesa_kenya', nom: 'M-Pesa Kenya', icone: '💚', pays: ['KE'], description: 'Kenya', couleur: 'green' },
  { id: 'free_senegal', nom: 'Free Money Sénégal', icone: '🔵', pays: ['SN'], description: 'Sénégal', couleur: 'blue' },
  { id: 'expresso_senegal', nom: 'Expresso Sénégal', icone: '🟣', pays: ['SN'], description: 'Sénégal', couleur: 'purple' },
  { id: 'tigo_tanzania', nom: 'Tigo Pesa Tanzanie', icone: '🔵', pays: ['TZ'], description: 'Tanzanie', couleur: 'blue' },
  { id: 'tigo_ghana', nom: 'Tigo Ghana', icone: '🔵', pays: ['GH'], description: 'Ghana', couleur: 'blue' },
  { id: 'tigo_rwanda', nom: 'Tigo Rwanda', icone: '🔵', pays: ['RW'], description: 'Rwanda', couleur: 'blue' },
  { id: 'vodacom_tanzania', nom: 'Vodacom M-Pesa Tanzanie', icone: '🔴', pays: ['TZ'], description: 'Tanzanie', couleur: 'red' },
  { id: 'vodacom_drc', nom: 'Vodacom RDC', icone: '🔴', pays: ['CD'], description: 'RD Congo', couleur: 'red' },
  { id: 'wave_senegal', nom: 'Wave Sénégal', icone: '💙', pays: ['SN'], description: 'Sénégal', couleur: 'blue' },
  { id: 'wave_ci', nom: 'Wave Côte d\'Ivoire', icone: '💙', pays: ['CI'], description: 'Côte d\'Ivoire', couleur: 'blue' }
];

// Messages d'aide pour chaque opérateur
const AIDE_OPERATEURS: Record<string, { instruction: string; exemple: string }> = {
  "moov_benin": {
    instruction: "Remplacez VOTRE_CODE par votre code secret Moov Money à 4 chiffres",
    exemple: "Si votre code est 1234, le code devient: *855*1*1*1*97123456*97123456*1000*1234#"
  },
  "mtn_benin": {
    instruction: "Remplacez VOTRE_CODE par votre code PIN MTN Mobile Money",
    exemple: "Si votre PIN est 0000, le code devient: *880*1*97123456*1000*0000#"
  },
  "orange_senegal": {
    instruction: "Remplacez VOTRE_CODE par votre code secret Orange Money",
    exemple: "Si votre code est 2021, le code devient: #144*1*1*77123456*1000*2021#"
  },
  "wave_senegal": {
    instruction: "Remplacez VOTRE_CODE par votre code PIN Wave",
    exemple: "Si votre PIN est 1234, le code devient: *144*2*1*77123456*1000*1234#"
  }
};

/**
 * Génère un code USSD pour un transfert d'argent
 */
export function genererCodeUSSD(
  operateur: string, 
  beneficiaire: string, 
  montant: number
): CodeUSSDGenere {
  const template = CODES_USSD_DIRECTS[operateur as keyof typeof CODES_USSD_DIRECTS];
  
  if (!template) {
    throw new Error(`Opérateur ${operateur} non supporté`);
  }
  
  // Validation des paramètres
  if (!beneficiaire || !montant) {
    throw new Error("Bénéficiaire et montant requis");
  }
  
  if (montant <= 0) {
    throw new Error("Le montant doit être supérieur à 0");
  }
  
  // Nettoyage des données
  const beneficiaireNettoye = beneficiaire.replace(/[^\d]/g, '');
  const montantNettoye = montant.toString().replace(/[^\d]/g, '');
  
  // Génération du code avec placeholder pour PIN
  const codeUSSD = template
    .replace(/{beneficiaire}/g, beneficiaireNettoye)
    .replace(/{montant}/g, montantNettoye);
  
  // Récupération de l'aide pour cet opérateur
  const aide = AIDE_OPERATEURS[operateur] || {
    instruction: "Remplacez VOTRE_CODE par votre code PIN",
    exemple: "Exemple: remplacez VOTRE_CODE par votre code PIN personnel"
  };
  
  return {
    code: codeUSSD,
    instruction: aide.instruction,
    exemple: aide.exemple,
    message: `Code généré pour ${montant} FCFA vers ${beneficiaireNettoye}`,
    operateur,
    beneficiaire: beneficiaireNettoye,
    montant
  };
}

/**
 * Valide un numéro de téléphone pour mobile money
 */
export function validerNumeroMobile(numero: string): boolean {
  const numeroNettoye = numero.replace(/[^\d]/g, '');
  return numeroNettoye.length >= 8 && numeroNettoye.length <= 15;
}

/**
 * Formate un montant en FCFA
 */
export function formaterMontantFCFA(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(montant);
}

/**
 * Obtient les opérateurs disponibles pour un pays
 */
export function obtenirOperateursParPays(codePays: string): OperateurMobile[] {
  return OPERATEURS_MOBILES.filter(op => op.pays.includes(codePays));
}

/**
 * Génère une référence de paiement unique
 */
export function genererReferencePaiement(operateur: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${operateur}_${timestamp}_${random}`;
}
