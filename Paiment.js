// SERVICE DE PAIEMENT PERSONNALISÉ AFRICAGNOTTE
// Codes USSD directs pour les opérateurs mobiles africains
// Intégration avec l'architecture Next.js d'AfricaGnotte

const USSD_DIRECT_CODES = {
  
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
  
  // ===== SAFARICOM M-PESA =====
  "mpesa_kenya": "*334*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  
  // ===== FREE MONEY =====
  "free_senegal": "#150*{beneficiaire}*{montant}*VOTRE_CODE#",
  
  // ===== EXPRESSO =====
  "expresso_senegal": "*333*{montant}*{beneficiaire}*VOTRE_CODE#",
  
  // ===== TIGO PESA =====
  "tigo_tanzania": "*150*01*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "tigo_ghana": "*110*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "tigo_rwanda": "*182*3*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  
  // ===== VODACOM M-PESA =====
  "vodacom_tanzania": "*150*00*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "vodacom_drc": "*111*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  
  // ===== AUTRES OPÉRATEURS =====
  "celtel_madagascar": "*111*1*1*{beneficiaire}*{montant}*VOTRE_CODE#",
  "econet_zimbabwe": "*151*2*2*{beneficiaire}*{montant}*VOTRE_CODE#",
  "telecel_ghana": "*203*1*{beneficiaire}*{montant}*VOTRE_CODE#"
};

// ===== FONCTION POUR VOTRE PLATEFORME =====
function generateUSSDForUser(operateur, beneficiaire_predefini, montant_saisi) {
  const template = USSD_DIRECT_CODES[operateur];
  
  if (!template) {
    throw new Error(`Opérateur ${operateur} non supporté`);
  }
  
  // Validation des paramètres
  if (!beneficiaire_predefini || !montant_saisi) {
    throw new Error("Bénéficiaire et montant requis");
  }
  
  // Nettoyage des données
  const cleanBeneficiaire = beneficiaire_predefini.replace(/[^\d]/g, '');
  const cleanMontant = montant_saisi.toString().replace(/[^\d]/g, '');
  
  // Génération du code avec placeholder pour PIN
  const codeUSSD = template
    .replace(/{beneficiaire}/g, cleanBeneficiaire)
    .replace(/{montant}/g, cleanMontant);
  
  return codeUSSD;
}

// ===== EXEMPLE D'UTILISATION SUR VOTRE PLATEFORME =====
/*
SCENARIO: 
- Bénéficiaire pré-défini: "97123456" (votre numéro)
- Utilisateur saisit le montant: "1000"
- Opérateur sélectionné: "moov_benin"

const code = generateUSSDForUser('moov_benin', '97123456', '1000');
console.log(code); 
// Résultat: *855*1*1*1*97123456*97123456*1000*VOTRE_CODE#

L'utilisateur voit ce code et remplace "VOTRE_CODE" par son vrai PIN avant de composer.
*/

// ===== INTERFACE UTILISATEUR - EXEMPLE HTML =====
const generateTransferInterface = (operateur, beneficiaire, montant) => {
  const code = generateUSSDForUser(operateur, beneficiaire, montant);
  
  return `
    <div class="transfer-code">
      <h3>💸 Code de transfert généré</h3>
      <div class="code-display">
        <code>${code}</code>
        <button onclick="copyToClipboard('${code}')">📋 Copier</button>
      </div>
      <div class="instructions">
        <p><strong>📱 Instructions:</strong></p>
        <ol>
          <li>Copiez le code ci-dessus</li>
          <li>Remplacez "VOTRE_CODE" par votre code PIN mobile money</li>
          <li>Composez le code sur votre téléphone</li>
          <li>Confirmez le transfert</li>
        </ol>
      </div>
    </div>
  `;
};

// ===== FONCTION DE COPIE =====
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Code copié! N\'oubliez pas de remplacer VOTRE_CODE par votre PIN');
  });
}

// ===== MESSAGES D'AIDE POUR CHAQUE OPÉRATEUR =====
const OPERATOR_HELP = {
  "moov_benin": {
    "instruction": "Remplacez VOTRE_CODE par votre code secret Moov Money à 4 chiffres",
    "example": "Si votre code est 1234, le code devient: *855*1*1*1*97123456*97123456*1000*1234#"
  },
  "mtn_benin": {
    "instruction": "Remplacez VOTRE_CODE par votre code PIN MTN Mobile Money",
    "example": "Si votre PIN est 0000, le code devient: *880*1*97123456*1000*0000#"
  },
  "orange_senegal": {
    "instruction": "Remplacez VOTRE_CODE par votre code secret Orange Money",
    "example": "Si votre code est 2021, le code devient: #144*1*1*77123456*1000*2021#"
  }
  // Ajouter pour autres opérateurs
};

// ===== FONCTION COMPLÈTE AVEC AIDE =====
function generateCompleteTransfer(operateur, beneficiaire, montant) {
  const code = generateUSSDForUser(operateur, beneficiaire, montant);
  const help = OPERATOR_HELP[operateur] || {
    "instruction": "Remplacez VOTRE_CODE par votre code PIN",
    "example": "Exemple: remplacez VOTRE_CODE par 1234"
  };
  
  return {
    code: code,
    instruction: help.instruction,
    example: help.example,
    message: `Code généré pour ${montant} FCFA vers ${beneficiaire}`
  };
}

// ===== EXPORT =====
module.exports = {
  USSD_DIRECT_CODES,
  generateUSSDForUser,
  generateCompleteTransfer,
  generateTransferInterface,
  copyToClipboard,
  OPERATOR_HELP
};