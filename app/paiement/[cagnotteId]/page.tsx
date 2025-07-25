'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { FaArrowLeft, FaLock, FaHeart, FaMobileAlt } from 'react-icons/fa';
import { useCagnotte } from '../../../hooks/useCagnotte';
import CagnotteSummary from '../../../components/CagnotteSummary';
import CodeUSSDGenerator from '../../../components/CodeUSSDGenerator';
import PreuvePaiementUpload from '../../../components/PreuvePaiementUpload';
import { OPERATEURS_MOBILES, type OperateurMobile, type CodeUSSDGenere, genererReferencePaiement } from '../../../lib/paiement-service';

// Types pour les étapes du paiement
type EtapePaiement = 'selection' | 'code_ussd' | 'preuve' | 'confirmation';

// Les numéros de bénéficiaire seront récupérés depuis la cagnotte

const suggestedAmounts = [1000, 2500, 5000, 10000]; // Montants en FCFA

export default function PaiementPage() {
  const params = useParams();
  const cagnotteId = params?.cagnotteId as string;
  
  // États du formulaire
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedOperateur, setSelectedOperateur] = useState<OperateurMobile | null>(null);
  const [loading, setLoading] = useState(false);

  // États pour le nouveau système de paiement
  const [etapeActuelle, setEtapeActuelle] = useState<EtapePaiement>('selection');
  const [codeGenere, setCodeGenere] = useState<CodeUSSDGenere | null>(null);
  const [donationId, setDonationId] = useState<string | null>(null);
  
  // Charger les données de la cagnotte
  const { cagnotte, loading: cagnotteLoading, error: cagnotteError } = useCagnotte(cagnotteId || '');

  // Validation email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Gestion de la sélection du montant
  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    } else {
      setAmount('');
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!fullName.trim()) {
      toast.error('Veuillez entrer votre nom complet');
      return;
    }
    
    if (!email.trim() || !isValidEmail(email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }
    
    if (!amount || amount <= 0) {
      toast.error('Veuillez sélectionner un montant valide');
      return;
    }
    
    if (!selectedOperateur) {
      toast.error('Veuillez choisir un opérateur mobile');
      return;
    }

    // Vérifier qu'un numéro de dépôt est disponible pour cet opérateur
    const numeroBeneficiaire = obtenirNumeroBeneficiaire(selectedOperateur.id);
    if (!numeroBeneficiaire || numeroBeneficiaire.trim() === '') {
      toast.error('Aucun numéro de dépôt configuré pour cet opérateur');
      return;
    }

    try {
      setLoading(true);
      
      // Créer le don avec le nouveau système
      const paymentReference = genererReferencePaiement(selectedOperateur.id);
      const donationData = {
        donor_name: fullName.trim(),
        amount: Number(amount),
        comment: message.trim() || null,
        is_anonymous: isAnonymous,
        payment_reference: paymentReference,
        payment_method: selectedOperateur.id,
        payment_status: 'pending'
      };

      const response = await fetch(`/api/cagnottes/${cagnotteId}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création du don');
      }

      // Stocker l'ID de la donation et passer à l'étape suivante
      setDonationId(result.donation.id);
      toast.success('Don créé avec succès ! Génération du code de paiement...');
      setEtapeActuelle('code_ussd');

    } catch (error) {
      console.error('Erreur lors de la création du don:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Gestion du code USSD généré
  const handleCodeGenere = (code: CodeUSSDGenere) => {
    setCodeGenere(code);
  };

  // Passage à l'étape de preuve de paiement
  const passerAPreuve = () => {
    setEtapeActuelle('preuve');
  };

  // Gestion de l'upload de preuve
  const handlePreuveUpload = async (urlImage: string) => {

    try {
      // Mettre à jour la donation avec la preuve de paiement
      const response = await fetch(`/api/cagnottes/${cagnotteId}/donations/${donationId}/preuve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proof_image_url: urlImage,
          payment_status: 'proof_uploaded'
        })
      });

      if (response.ok) {
        setEtapeActuelle('confirmation');
        toast.success('Preuve de paiement enregistrée ! Votre don sera vérifié sous peu.');
      } else {
        throw new Error('Erreur lors de l\'enregistrement de la preuve');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement de la preuve');
      console.error(error);
    }
  };

  // Retour à l'étape précédente
  const retourEtapePrecedente = () => {
    if (etapeActuelle === 'code_ussd') {
      setEtapeActuelle('selection');
    } else if (etapeActuelle === 'preuve') {
      setEtapeActuelle('code_ussd');
    }
  };

  // Obtenir le numéro de bénéficiaire selon l'opérateur sélectionné
  const obtenirNumeroBeneficiaire = (operateurId: string): string => {
    if (!cagnotte) return '';

    // Mapping des opérateurs vers les champs de la cagnotte
    const operateurMapping: Record<string, string> = {
      // Moov Money
      'moov_benin': cagnotte.numero_moov || '',
      'moov_burkina': cagnotte.numero_moov || '',
      'moov_togo': cagnotte.numero_moov || '',
      'moov_ci': cagnotte.numero_moov || '',

      // MTN Mobile Money
      'mtn_benin': cagnotte.numero_mtn || '',
      'mtn_cameroun': cagnotte.numero_mtn || '',
      'mtn_congo': cagnotte.numero_mtn || '',
      'mtn_ci': cagnotte.numero_mtn || '',
      'mtn_ghana': cagnotte.numero_mtn || '',
      'mtn_uganda': cagnotte.numero_mtn || '',
      'mtn_rwanda': cagnotte.numero_mtn || '',
      'mtn_zambia': cagnotte.numero_mtn || '',

      // Orange Money
      'orange_senegal': cagnotte.numero_orange || '',
      'orange_mali': cagnotte.numero_orange || '',
      'orange_ci': cagnotte.numero_orange || '',
      'orange_cameroun': cagnotte.numero_orange || '',
      'orange_burkina': cagnotte.numero_orange || '',
      'orange_niger': cagnotte.numero_orange || '',
      'orange_madagascar': cagnotte.numero_orange || '',

      // Wave
      'wave_senegal': cagnotte.numero_wave || '',
      'wave_ci': cagnotte.numero_wave || '',

      // Airtel Money
      'airtel_niger': cagnotte.numero_airtel || '',
      'airtel_madagascar': cagnotte.numero_airtel || '',
      'airtel_kenya': cagnotte.numero_airtel || '',
      'airtel_tanzania': cagnotte.numero_airtel || '',
      'airtel_uganda': cagnotte.numero_airtel || '',
      'airtel_rwanda': cagnotte.numero_airtel || '',
      'airtel_zambia': cagnotte.numero_airtel || '',
      'airtel_malawi': cagnotte.numero_airtel || '',

      // Autres opérateurs
      'mpesa_kenya': cagnotte.numero_autres || '',
      'free_senegal': cagnotte.numero_autres || '',
      'expresso_senegal': cagnotte.numero_autres || '',
      'tigo_tanzania': cagnotte.numero_autres || '',
      'tigo_ghana': cagnotte.numero_autres || '',
      'tigo_rwanda': cagnotte.numero_autres || '',
      'vodacom_tanzania': cagnotte.numero_autres || '',
      'vodacom_drc': cagnotte.numero_autres || '',
    };

    return operateurMapping[operateurId] || '';
  };

  // Filtrer les opérateurs disponibles selon les numéros renseignés
  const operateursDisponibles = OPERATEURS_MOBILES.filter(operateur => {
    const numero = obtenirNumeroBeneficiaire(operateur.id);
    return numero && numero.trim() !== '';
  });

  if (cagnotteLoading) {
    return (
      <main className="py-10 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </main>
    );
  }

  if (cagnotteError || !cagnotte) {
    return (
      <main className="py-10 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
            <p className="text-gray-600 mb-6">{cagnotteError || 'Cagnotte introuvable'}</p>
            <Link
              href="/cagnottes"
              className="inline-block bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Retour aux cagnottes
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-10 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 max-w-2xl">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href={`/c/${cagnotte.custom_url || cagnotteId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Retour à la cagnotte
          </Link>
          <h1 className="text-3xl font-bold text-center mb-2">Participer à la cagnotte</h1>
          <h2 className="text-xl text-gray-600 text-center">{cagnotte.title}</h2>
        </div>

        {/* Résumé de la cagnotte */}
        <CagnotteSummary cagnotte={cagnotte} />

        {/* Sécurité */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center">
          <FaLock className="text-green-600 mr-3" />
          <div>
            <p className="font-medium text-green-800">Plateforme 100% sécurisée</p>
            <p className="text-sm text-green-600">Transactions cryptées et sécurisées en SSL/HTTPS.</p>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${etapeActuelle === 'selection' ? 'text-lime-600' : etapeActuelle === 'code_ussd' || etapeActuelle === 'preuve' || etapeActuelle === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${etapeActuelle === 'selection' ? 'bg-lime-100' : etapeActuelle === 'code_ussd' || etapeActuelle === 'preuve' || etapeActuelle === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>1</div>
              <span className="ml-2 font-medium">Informations</span>
            </div>
            <div className={`flex items-center ${etapeActuelle === 'code_ussd' ? 'text-lime-600' : etapeActuelle === 'preuve' || etapeActuelle === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${etapeActuelle === 'code_ussd' ? 'bg-lime-100' : etapeActuelle === 'preuve' || etapeActuelle === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>2</div>
              <span className="ml-2 font-medium">Code USSD</span>
            </div>
            <div className={`flex items-center ${etapeActuelle === 'preuve' ? 'text-lime-600' : etapeActuelle === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${etapeActuelle === 'preuve' ? 'bg-lime-100' : etapeActuelle === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>3</div>
              <span className="ml-2 font-medium">Preuve</span>
            </div>
            <div className={`flex items-center ${etapeActuelle === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${etapeActuelle === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>4</div>
              <span className="ml-2 font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Étape 1: Sélection et informations */}
        {etapeActuelle === 'selection' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Montant de participation */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-4">Montant de votre participation :</label>
            
            {/* Montants suggérés */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {suggestedAmounts.map((suggestedAmount) => (
                <button
                  key={suggestedAmount}
                  type="button"
                  onClick={() => handleAmountSelect(suggestedAmount)}
                  className={`p-3 border-2 rounded-lg font-medium transition-colors ${
                    amount === suggestedAmount
                      ? 'border-lime-500 bg-lime-50 text-lime-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {suggestedAmount.toLocaleString()} FCFA
                </button>
              ))}
            </div>

            {/* Montant personnalisé */}
            <div className="relative">
              <input
                type="number"
                placeholder="Autre montant"
                min="1"
                step="1"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-center text-2xl font-bold"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">FCFA</span>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Vos coordonnées :</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom & prénom"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                required
              />
              <input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                required
              />
            </div>
          </div>

          {/* Message de soutien */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Message de soutien (optionnel) :</label>
            <textarea
              placeholder="Laissez un message d'encouragement..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          {/* Option don anonyme */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 mr-3 text-lime-500 focus:ring-lime-500"
              />
              <span className="text-gray-700">Faire un don anonyme (votre nom ne sera pas affiché publiquement)</span>
            </label>
          </div>

          {/* Sélection d'opérateur mobile */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaMobileAlt className="text-lime-600" />
              Choisissez votre opérateur mobile :
            </h3>

            {operateursDisponibles.length === 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-center">
                  <strong>Aucun opérateur disponible</strong><br />
                  Le créateur de cette cagnotte n&apos;a pas encore configuré de numéros de dépôt.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {operateursDisponibles.map((operateur) => (
                <button
                  key={operateur.id}
                  type="button"
                  onClick={() => setSelectedOperateur(operateur)}
                  className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                    selectedOperateur?.id === operateur.id
                      ? 'border-lime-500 bg-lime-50 shadow-md'
                      : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{operateur.icone}</span>
                    <div>
                      <div className="font-medium text-gray-800">{operateur.nom}</div>
                      <div className="text-sm text-gray-500">{operateur.description}</div>
                    </div>
                  </div>
                </button>
              ))}
              </div>
            )}

            {selectedOperateur && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedOperateur.icone}</span>
                  <span className="font-medium text-blue-800">{selectedOperateur.nom} sélectionné</span>
                </div>
                <p className="text-sm text-blue-700">
                  Un code USSD sera généré pour effectuer le transfert directement depuis votre téléphone.
                </p>
              </div>
            )}
          </div>

          {/* Bouton de validation */}
          <button
            type="submit"
            disabled={loading || !amount || !selectedOperateur}
            className="w-full bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <FaHeart className="text-lg" />
            {loading ? 'Traitement en cours...' : `Continuer - ${amount ? `${Number(amount).toLocaleString()} FCFA` : 'Sélectionner un montant'}`}
          </button>

          {/* Informations légales */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              En cliquant sur &quot;Valider et payer&quot;, vous acceptez nos{' '}
              <Link href="/conditions" className="text-lime-600 hover:underline">
                conditions d&apos;utilisation
              </Link>{' '}
              et notre{' '}
              <Link href="/confidentialite" className="text-lime-600 hover:underline">
                politique de confidentialité
              </Link>
              .
            </p>
          </div>
        </form>
        )}

        {/* Étape 2: Génération du code USSD */}
        {etapeActuelle === 'code_ussd' && selectedOperateur && amount && (
          <div className="space-y-6">
            <CodeUSSDGenerator
              operateur={selectedOperateur}
              beneficiaire={obtenirNumeroBeneficiaire(selectedOperateur.id)}
              montant={Number(amount)}
              onCodeGenere={handleCodeGenere}
            />

            {codeGenere && (
              <div className="flex gap-3">
                <button
                  onClick={retourEtapePrecedente}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={passerAPreuve}
                  className="flex-1 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  J&apos;ai effectué le transfert
                </button>
              </div>
            )}
          </div>
        )}

        {/* Étape 3: Upload de preuve de paiement */}
        {etapeActuelle === 'preuve' && (
          <PreuvePaiementUpload
            montant={Number(amount)}
            operateur={selectedOperateur?.nom || ''}
            onPreuveUpload={handlePreuveUpload}
            onAnnuler={retourEtapePrecedente}
          />
        )}

        {/* Étape 4: Confirmation */}
        {etapeActuelle === 'confirmation' && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Don enregistré avec succès !</h2>
            <p className="text-gray-600 mb-6">
              Votre don de <strong>{Number(amount).toLocaleString()} FCFA</strong> a été enregistré.
              Notre équipe vérifiera votre preuve de paiement et validera votre contribution sous peu.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                <strong>Prochaines étapes :</strong><br />
                • Vérification de votre preuve de paiement (sous 24h)<br />
                • Validation de votre don<br />
                • Notification par email de la confirmation
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/c/${cagnotte?.custom_url || cagnotteId}`}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors text-center"
              >
                Retour à la cagnotte
              </Link>
              <Link
                href="/recherche"
                className="flex-1 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center"
              >
                Découvrir d&apos;autres cagnottes
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
