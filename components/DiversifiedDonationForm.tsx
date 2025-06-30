'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaMoneyBillWave, FaHandsHelping, FaBox, FaBrain } from 'react-icons/fa';

interface DonationCategory {
  id: string;
  type: 'service' | 'material' | 'skill';
  name: string;
  description: string;
  icon: string;
}

interface DiversifiedDonationFormProps {
  cagnotteId: string;
  onDonationSuccess?: () => void;
}

type DonationType = 'monetary' | 'service' | 'material' | 'skill';

export default function DiversifiedDonationForm({ cagnotteId, onDonationSuccess }: DiversifiedDonationFormProps) {
  const [donationType, setDonationType] = useState<DonationType>('monetary');
  const [categories, setCategories] = useState<DonationCategory[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Champs communs
  const [donorName, setDonorName] = useState('');
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: ''
  });
  
  // Champs pour don monétaire
  const [amount, setAmount] = useState<number | ''>('');
  
  // Champs pour services
  const [serviceType, setServiceType] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceDuration, setServiceDuration] = useState<number | ''>('');
  const [serviceAvailability, setServiceAvailability] = useState('');
  
  // Champs pour biens matériels
  const [materialType, setMaterialType] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState<number | ''>('');
  const [materialCondition, setMaterialCondition] = useState('');
  
  // Champs pour compétences
  const [skillType, setSkillType] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [skillAvailability, setSkillAvailability] = useState('');
  
  // Champs communs pour dons non-monétaires
  const [estimatedValue, setEstimatedValue] = useState<number | ''>('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [locationConstraint, setLocationConstraint] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [donationType]);

  const fetchCategories = async () => {
    if (donationType === 'monetary') return;
    
    try {
      const response = await fetch(`/api/donation-categories?type=${donationType}`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!donorName.trim()) {
      toast.error('Veuillez entrer votre nom');
      return;
    }

    // Validation spécifique selon le type de don
    if (donationType === 'monetary') {
      if (!amount || amount <= 0) {
        toast.error('Veuillez entrer un montant valide');
        return;
      }
    } else {
      if (!estimatedValue || estimatedValue <= 0) {
        toast.error('Veuillez estimer la valeur de votre contribution');
        return;
      }
      
      if (!contactInfo.email && !contactInfo.phone) {
        toast.error('Veuillez fournir au moins un moyen de contact');
        return;
      }
    }

    try {
      setLoading(true);
      
      const donationData = {
        donor_name: donorName.trim(),
        comment: comment.trim() || null,
        is_anonymous: isAnonymous,
        donation_type: donationType,
        contact_info: donationType !== 'monetary' ? contactInfo : null,
        delivery_method: deliveryMethod || null,
        location_constraint: locationConstraint || null,
        estimated_value: donationType !== 'monetary' ? Number(estimatedValue) : null,
        
        // Don monétaire
        ...(donationType === 'monetary' && {
          amount: Number(amount),
          payment_reference: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }),
        
        // Service
        ...(donationType === 'service' && {
          service_type: serviceType,
          service_description: serviceDescription,
          service_duration: serviceDuration ? Number(serviceDuration) : null,
          service_availability: serviceAvailability
        }),
        
        // Bien matériel
        ...(donationType === 'material' && {
          material_type: materialType,
          material_description: materialDescription,
          material_quantity: materialQuantity ? Number(materialQuantity) : null,
          material_condition: materialCondition
        }),
        
        // Compétence
        ...(donationType === 'skill' && {
          skill_type: skillType,
          skill_description: skillDescription,
          skill_level: skillLevel,
          skill_availability: skillAvailability
        })
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

      const successMessage = donationType === 'monetary' 
        ? 'Don créé avec succès ! En attente de confirmation de paiement.'
        : 'Contribution enregistrée avec succès ! Nous vous contacterons bientôt.';
      
      toast.success(successMessage);
      
      // Réinitialiser le formulaire
      resetForm();
      
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

  const resetForm = () => {
    setDonorName('');
    setComment('');
    setIsAnonymous(false);
    setContactInfo({ email: '', phone: '', address: '' });
    setAmount('');
    setServiceType('');
    setServiceDescription('');
    setServiceDuration('');
    setServiceAvailability('');
    setMaterialType('');
    setMaterialDescription('');
    setMaterialQuantity('');
    setMaterialCondition('');
    setSkillType('');
    setSkillDescription('');
    setSkillLevel('');
    setSkillAvailability('');
    setEstimatedValue('');
    setDeliveryMethod('');
    setLocationConstraint('');
  };

  const donationTypes = [
    { type: 'monetary' as DonationType, label: 'Don monétaire', icon: FaMoneyBillWave, color: 'text-green-600' },
    { type: 'service' as DonationType, label: 'Service', icon: FaHandsHelping, color: 'text-blue-600' },
    { type: 'material' as DonationType, label: 'Bien matériel', icon: FaBox, color: 'text-orange-600' },
    { type: 'skill' as DonationType, label: 'Compétence', icon: FaBrain, color: 'text-purple-600' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">Contribuer au projet</h3>
      
      {/* Sélection du type de don */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Type de contribution</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {donationTypes.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              type="button"
              onClick={() => setDonationType(type)}
              className={`p-3 border-2 rounded-lg text-center transition-all ${
                donationType === type
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`mx-auto mb-2 text-xl ${color}`} />
              <div className="text-sm font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champs communs */}
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

        {/* Contenu spécifique selon le type de don */}
        {donationType === 'monetary' && (
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Montant du don (FCFA) *
            </label>
            <input
              type="number"
              id="amount"
              placeholder="50000"
              min="1"
              step="1"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
              required
              disabled={loading}
            />
          </div>
        )}

        {/* Formulaire pour services */}
        {donationType === 'service' && (
          <>
            <div>
              <label htmlFor="service-type" className="block text-sm font-medium mb-2">
                Type de service *
              </label>
              <select
                id="service-type"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Sélectionnez un type de service</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="service-description" className="block text-sm font-medium mb-2">
                Description du service *
              </label>
              <textarea
                id="service-description"
                placeholder="Décrivez en détail le service que vous proposez..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="service-duration" className="block text-sm font-medium mb-2">
                  Durée (heures)
                </label>
                <input
                  type="number"
                  id="service-duration"
                  placeholder="8"
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value ? Number(e.target.value) : '')}
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="service-availability" className="block text-sm font-medium mb-2">
                  Disponibilité
                </label>
                <input
                  type="text"
                  id="service-availability"
                  placeholder="Lundi-Vendredi 9h-17h"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={serviceAvailability}
                  onChange={(e) => setServiceAvailability(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </>
        )}

        {/* Formulaire pour biens matériels */}
        {donationType === 'material' && (
          <>
            <div>
              <label htmlFor="material-type" className="block text-sm font-medium mb-2">
                Type de bien matériel *
              </label>
              <select
                id="material-type"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Sélectionnez un type de bien</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="material-description" className="block text-sm font-medium mb-2">
                Description du bien *
              </label>
              <textarea
                id="material-description"
                placeholder="Décrivez en détail le bien que vous souhaitez donner..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="material-quantity" className="block text-sm font-medium mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  id="material-quantity"
                  placeholder="1"
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={materialQuantity}
                  onChange={(e) => setMaterialQuantity(e.target.value ? Number(e.target.value) : '')}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="material-condition" className="block text-sm font-medium mb-2">
                  État
                </label>
                <select
                  id="material-condition"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={materialCondition}
                  onChange={(e) => setMaterialCondition(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Sélectionnez l'état</option>
                  <option value="neuf">Neuf</option>
                  <option value="tres_bon">Très bon état</option>
                  <option value="bon">Bon état</option>
                  <option value="correct">État correct</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Formulaire pour compétences */}
        {donationType === 'skill' && (
          <>
            <div>
              <label htmlFor="skill-type" className="block text-sm font-medium mb-2">
                Type de compétence *
              </label>
              <select
                id="skill-type"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={skillType}
                onChange={(e) => setSkillType(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Sélectionnez un type de compétence</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="skill-description" className="block text-sm font-medium mb-2">
                Description de la compétence *
              </label>
              <textarea
                id="skill-description"
                placeholder="Décrivez votre expertise et comment vous pouvez aider..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="skill-level" className="block text-sm font-medium mb-2">
                  Niveau d'expertise
                </label>
                <select
                  id="skill-level"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Sélectionnez votre niveau</option>
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avance">Avancé</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label htmlFor="skill-availability" className="block text-sm font-medium mb-2">
                  Disponibilité
                </label>
                <input
                  type="text"
                  id="skill-availability"
                  placeholder="Weekends, soirées..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={skillAvailability}
                  onChange={(e) => setSkillAvailability(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </>
        )}

        {/* Champs communs pour dons non-monétaires */}
        {donationType !== 'monetary' && (
          <>
            <div>
              <label htmlFor="estimated-value" className="block text-sm font-medium mb-2">
                Valeur estimée (FCFA) *
              </label>
              <input
                type="number"
                id="estimated-value"
                placeholder="25000"
                min="1"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value ? Number(e.target.value) : '')}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium mb-2">
                  Email de contact
                </label>
                <input
                  type="email"
                  id="contact-email"
                  placeholder="votre@email.com"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="contact-phone"
                  placeholder="+221 XX XXX XX XX"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="delivery-method" className="block text-sm font-medium mb-2">
                  Mode de livraison
                </label>
                <select
                  id="delivery-method"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Sélectionnez</option>
                  <option value="domicile">À domicile</option>
                  <option value="point_relais">Point relais</option>
                  <option value="sur_place">Sur place</option>
                  <option value="a_convenir">À convenir</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="location-constraint" className="block text-sm font-medium mb-2">
                Contraintes géographiques
              </label>
              <input
                type="text"
                id="location-constraint"
                placeholder="Dakar et environs, rayon de 50km..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={locationConstraint}
                onChange={(e) => setLocationConstraint(e.target.value)}
                disabled={loading}
              />
            </div>
          </>
        )}

        {/* Commentaire */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Message (optionnel)
          </label>
          <textarea
            id="comment"
            placeholder="Ajoutez un message d'encouragement..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Anonymat */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            className="mr-2"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="anonymous" className="text-sm">
            Rester anonyme
          </label>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-3 px-6 rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Envoi en cours...' :
           donationType === 'monetary' ? 'Faire le don' : 'Proposer ma contribution'}
        </button>
      </form>
    </div>
  );
}
