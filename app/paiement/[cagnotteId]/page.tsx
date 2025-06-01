'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { FaArrowLeft, FaLock, FaHeart } from 'react-icons/fa';
import { useCagnotte } from '../../../hooks/useCagnotte';
import CagnotteSummary from '../../../components/CagnotteSummary';

// Types pour les méthodes de paiement
interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  category: 'mobile' | 'card' | 'crypto' | 'wallet';
  description: string;
  countries?: string[];
}

const paymentMethods: PaymentMethod[] = [
  // Mobile Money Afrique
  { id: 'orange_money', name: 'Orange Money', icon: '🟠', category: 'mobile', description: 'Côte d\'Ivoire, Mali, Sénégal', countries: ['CI', 'ML', 'SN'] },
  { id: 'mtn_money', name: 'MTN Mobile Money', icon: '🟡', category: 'mobile', description: 'Ghana, Ouganda, Rwanda', countries: ['GH', 'UG', 'RW'] },
  { id: 'airtel_money', name: 'Airtel Money', icon: '🔴', category: 'mobile', description: 'Kenya, Tanzania, Zambie', countries: ['KE', 'TZ', 'ZM'] },
  { id: 'wave', name: 'Wave', icon: '💙', category: 'mobile', description: 'Sénégal, Côte d\'Ivoire', countries: ['SN', 'CI'] },
  { id: 'moov_money', name: 'Moov Money', icon: '🟢', category: 'mobile', description: 'Bénin, Togo', countries: ['BJ', 'TG'] },
  
  // Paiements traditionnels
  { id: 'visa', name: 'Visa', icon: '💳', category: 'card', description: 'Carte bancaire internationale' },
  { id: 'mastercard', name: 'Mastercard', icon: '💳', category: 'card', description: 'Carte bancaire internationale' },
  { id: 'paypal', name: 'PayPal', icon: '💰', category: 'wallet', description: 'Portefeuille électronique' },
  
  // Cryptomonnaies
  { id: 'usdt', name: 'USDT (Tether)', icon: '💚', category: 'crypto', description: 'Stablecoin USD' },
  { id: 'btc', name: 'Bitcoin (BTC)', icon: '₿', category: 'crypto', description: 'Cryptomonnaie' },
  { id: 'eth', name: 'Ethereum (ETH)', icon: '⟠', category: 'crypto', description: 'Cryptomonnaie' },
  { id: 'sol', name: 'Solana (SOL)', icon: '◎', category: 'crypto', description: 'Cryptomonnaie' },
];

const suggestedAmounts = [10, 25, 50, 100];

export default function PaiementPage() {
  const params = useParams();
  const router = useRouter();
  const cagnotteId = params?.cagnotteId as string;
  
  // États du formulaire
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
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
    
    if (!selectedPaymentMethod) {
      toast.error('Veuillez choisir une méthode de paiement');
      return;
    }

    try {
      setLoading(true);
      
      // Créer le don
      const donationData = {
        donor_name: fullName.trim(),
        amount: Number(amount),
        comment: message.trim() || null,
        is_anonymous: isAnonymous,
        payment_reference: `${selectedPaymentMethod}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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

      toast.success('Don créé avec succès ! Redirection vers le paiement...');
      
      // Simuler la redirection vers le processeur de paiement
      setTimeout(() => {
        // Ici, vous intégreriez les vraies APIs de paiement
        toast.success('Paiement simulé avec succès !');
        router.push(`/c/${cagnotte?.custom_url || cagnotteId}?success=true`);
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de la création du don:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

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
    <main className="py-10 bg-gray-50 min-h-screen">
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
                  {suggestedAmount}€
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
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">€</span>
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

          {/* Méthodes de paiement */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Mode de paiement :</h3>
            
            {/* Mobile Money */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">💱 Mobile Money Afrique</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {paymentMethods.filter(method => method.category === 'mobile').map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-3 border-2 rounded-lg text-left transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-lime-500 bg-lime-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cartes et PayPal */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">💳 Cartes bancaires & Portefeuilles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {paymentMethods.filter(method => method.category === 'card' || method.category === 'wallet').map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-3 border-2 rounded-lg text-left transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-lime-500 bg-lime-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cryptomonnaies */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">₿ Cryptomonnaies</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {paymentMethods.filter(method => method.category === 'crypto').map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-3 border-2 rounded-lg text-left transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-lime-500 bg-lime-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bouton de validation */}
          <button
            type="submit"
            disabled={loading || !amount || !selectedPaymentMethod}
            className="w-full bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <FaHeart className="text-lg" />
            {loading ? 'Traitement en cours...' : `Valider et payer ${amount}€`}
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
      </div>
    </main>
  );
}
