'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface DonationFormProps {
  cagnotteId: string;
  onDonationSuccess?: () => void;
}

export default function DonationForm({ cagnotteId, onDonationSuccess }: DonationFormProps) {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!donorName.trim()) {
      toast.error('Veuillez entrer votre nom');
      return;
    }
    
    if (!amount || amount <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    try {
      setLoading(true);
      
      const donationData = {
        donor_name: donorName.trim(),
        amount: Number(amount),
        comment: comment.trim() || null,
        is_anonymous: isAnonymous,
        payment_reference: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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

      toast.success('Don créé avec succès ! En attente de confirmation de paiement.');
      
      // Réinitialiser le formulaire
      setDonorName('');
      setAmount('');
      setComment('');
      setIsAnonymous(false);
      
      // Callback pour recharger les données
      if (onDonationSuccess) {
        onDonationSuccess();
      }

    } catch (error) {
      console.error('Erreur lors de la création du don:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Faire un don</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="donor-name" className="block text-sm font-medium mb-2">
            Votre nom *
          </label>
          <input
            type="text"
            id="donor-name"
            placeholder="Entrez votre nom"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Montant du don (€) *
          </label>
          <input
            type="number"
            id="amount"
            placeholder="50"
            min="1"
            step="1"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Message de soutien (optionnel)
          </label>
          <textarea
            id="comment"
            placeholder="Laissez un message d'encouragement..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            className="w-4 h-4 mr-3 text-amber-500 focus:ring-amber-500"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700">
            Faire un don anonyme (votre nom ne sera pas affiché publiquement)
          </label>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <h4 className="font-medium text-amber-800 mb-2">💡 Informations importantes :</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• <strong>Aucun compte requis</strong> - Vous pouvez donner sans vous inscrire</li>
            <li>• <strong>Paiement sécurisé</strong> - Cartes bancaires, PayPal, Mobile Money</li>
            <li>• <strong>Don anonyme</strong> - Votre nom peut rester privé si vous le souhaitez</li>
            <li>• <strong>Confirmation</strong> - Vous recevrez une confirmation par email</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Traitement en cours...' : 'Faire un don'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          En cliquant sur "Faire un don", vous acceptez nos conditions d'utilisation.
          <br />
          Votre don sera traité de manière sécurisée.
        </p>
      </div>
    </div>
  );
}
