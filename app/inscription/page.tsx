'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Inscription() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'individual', // 'individual' ou 'association'
    associationName: '',
    birthDate: '',
    isMajor: false,
    country: '',
    acceptTerms: false
  });
  
  const [isBirthDateValid, setIsBirthDateValid] = useState(true);
  
  // Les pays utilisant le franc CFA (XOF et XAF)
  const countries = {
    XOF: [
      { code: 'BJ', name: 'Bénin' },
      { code: 'BF', name: 'Burkina Faso' },
      { code: 'CI', name: 'Côte d\'Ivoire' },
      { code: 'GW', name: 'Guinée-Bissau' },
      { code: 'ML', name: 'Mali' },
      { code: 'NE', name: 'Niger' },
      { code: 'SN', name: 'Sénégal' },
      { code: 'TG', name: 'Togo' }
    ],
    XAF: [
      { code: 'CM', name: 'Cameroun' },
      { code: 'CF', name: 'République centrafricaine' },
      { code: 'TD', name: 'Tchad' },
      { code: 'CG', name: 'République du Congo' },
      { code: 'GQ', name: 'Guinée équatoriale' },
      { code: 'GA', name: 'Gabon' }
    ]
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'birthDate') {
      validateBirthDate(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Vérifier si la personne est majeure (18 ans ou plus)
  const validateBirthDate = (birthDateStr: string) => {
    if (!birthDateStr) {
      setIsBirthDateValid(false);
      setFormData(prev => ({ ...prev, isMajor: false }));
      return;
    }
    
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    // Calculer l'âge
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const isMajor = age >= 18;
    setIsBirthDateValid(true);
    setFormData(prev => ({ ...prev, isMajor }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (!formData.isMajor) {
      alert("Vous devez être majeur pour vous inscrire");
      return;
    }
    
    // À implémenter: logique d'inscription
    console.log('Données d\'inscription:', formData);
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:flex">
        <div className="hidden md:block md:w-1/2 bg-primary relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h2 className="text-3xl font-bold mb-4">Rejoignez AfriCagnotte</h2>
              <p className="text-lg mb-6">Créez et partagez des cagnottes pour toutes vos célébrations</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white">Créez des cagnottes gratuitement</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white">Partagez facilement avec vos proches</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white">Paiements sécurisés et faciles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary">Créer un compte</h2>
            <p className="text-sm text-gray-600 mt-1">Remplissez le formulaire pour commencer</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type de compte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de compte</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border rounded-md p-3 cursor-pointer ${formData.accountType === 'individual' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'individual' }))}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="individual"
                      checked={formData.accountType === 'individual'}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">
                      Particulier
                    </label>
                  </div>
                </div>
                <div 
                  className={`border rounded-md p-3 cursor-pointer ${formData.accountType === 'association' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'association' }))}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="association"
                      checked={formData.accountType === 'association'}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">
                      Association
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {formData.accountType === 'association' && (
              <div>
                <label htmlFor="associationName" className="block text-sm font-medium text-gray-700">Nom de l&apos;association</label>
                <input
                  id="associationName"
                  name="associationName"
                  type="text"
                  required={formData.accountType === 'association'}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.associationName}
                  onChange={handleChange}
                />
              </div>
            )}
            
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Date de naissance */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Date de naissance</label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${!isBirthDateValid || !formData.isMajor ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.birthDate}
                onChange={handleChange}
              />
              {!isBirthDateValid && (
                <p className="mt-1 text-sm text-red-600">Veuillez entrer une date de naissance valide</p>
              )}
              {isBirthDateValid && !formData.isMajor && formData.birthDate && (
                <p className="mt-1 text-sm text-red-600">Vous devez être majeur pour vous inscrire (18 ans minimum)</p>
              )}
            </div>
            
            {/* Pays */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Pays</label>
              <select
                id="country"
                name="country"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.country}
                onChange={handleChange}
              >
                <option value="" disabled>Sélectionnez votre pays</option>
                <optgroup label="Pays de l'UEMOA (Franc CFA - XOF)">
                  {countries.XOF.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Pays de la CEMAC (Franc CFA - XAF)">
                  {countries.XAF.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmez le mot de passe</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                J&apos;accepte les <a href="#" className="text-primary">conditions d&apos;utilisation</a> et la <a href="#" className="text-primary">politique de confidentialité</a>
              </label>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={!formData.isMajor}
              >
                S&apos;inscrire
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte?{' '}
              <Link href="/connexion" className="font-medium text-primary hover:text-primary/80">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 