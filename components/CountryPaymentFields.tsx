'use client';

import React from 'react';
import { getAvailableOperatorsForCountry, getRequiredOperatorsForCountry, PaymentOperator } from '../lib/country-payment-service';

interface CountryPaymentFieldsProps {
  userCountry: string;
  paymentNumbers: Record<string, string>;
  onPaymentNumberChange: (field: string, value: string) => void;
  showAllFields?: boolean; // Pour afficher tous les champs même si pas requis pour le pays
}

export default function CountryPaymentFields({ 
  userCountry, 
  paymentNumbers, 
  onPaymentNumberChange,
  showAllFields = false 
}: CountryPaymentFieldsProps) {
  
  // Obtenir les opérateurs pour le pays de l'utilisateur
  const availableOperators = getAvailableOperatorsForCountry(userCountry);
  const requiredOperators = getRequiredOperatorsForCountry(userCountry);
  
  // Si showAllFields est true, afficher tous les opérateurs possibles
  const allOperators: PaymentOperator[] = [
    { id: 'moov', name: 'Moov Money', field: 'numero_moov', icon: '🟠', color: 'orange' },
    { id: 'mtn', name: 'MTN Mobile Money', field: 'numero_mtn', icon: '🟡', color: 'yellow' },
    { id: 'orange', name: 'Orange Money', field: 'numero_orange', icon: '🟠', color: 'orange' },
    { id: 'wave', name: 'Wave', field: 'numero_wave', icon: '🔵', color: 'blue' },
    { id: 'airtel', name: 'Airtel Money', field: 'numero_airtel', icon: '🔴', color: 'red' },
    { id: 'autres', name: 'Autres opérateurs', field: 'numero_autres', icon: '📱', color: 'gray' },
  ];
  
  const operatorsToShow = showAllFields ? allOperators : availableOperators;
  
  const isOperatorRequired = (operator: PaymentOperator) => {
    return requiredOperators.some(req => req.field === operator.field);
  };
  
  const getFieldLabel = (operator: PaymentOperator) => {
    const isRequired = isOperatorRequired(operator);
    const requiredText = isRequired ? ' *' : '';
    return `${operator.icon} ${operator.name}${requiredText}`;
  };
  
  const getFieldPlaceholder = (operator: PaymentOperator) => {
    switch (operator.id) {
      case 'moov':
        return 'Ex: 97123456 ou +229 97123456';
      case 'mtn':
        return 'Ex: 67123456 ou +229 67123456';
      case 'orange':
        return 'Ex: 07123456 ou +225 07123456';
      case 'wave':
        return 'Ex: 77123456 ou +221 77123456';
      case 'airtel':
        return 'Ex: 78123456 ou +226 78123456';
      case 'autres':
        return 'Ex: 90123456 ou +243 90123456';
      default:
        return 'Numéro de téléphone';
    }
  };
  
  if (operatorsToShow.length === 0) {
    return (
      <div className="mb-5 sm:mb-6">
        <label className="block text-base sm:text-lg font-semibold mb-3">
          Numéros de dépôt pour recevoir les dons
        </label>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Pays non configuré :</strong> {userCountry}
          </p>
          <p className="text-sm text-yellow-700 mt-2">
            Veuillez renseigner au moins un numéro de téléphone mobile money dans les champs ci-dessous.
          </p>
        </div>
        
        {/* Afficher tous les champs si le pays n'est pas configuré */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {allOperators.map((operator) => (
            <div key={operator.field}>
              <label htmlFor={operator.field} className="block text-sm font-medium mb-1">
                {getFieldLabel(operator)}
              </label>
              <input
                type="tel"
                id={operator.field}
                placeholder={getFieldPlaceholder(operator)}
                className="w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                value={paymentNumbers[operator.field] || ''}
                onChange={(e) => onPaymentNumberChange(operator.field, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-5 sm:mb-6">
      <label className="block text-base sm:text-lg font-semibold mb-3">
        Numéros de dépôt pour recevoir les dons
      </label>
      
      {/* Information sur le pays */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Pays sélectionné :</strong> {userCountry}
        </p>
        <p className="text-sm text-blue-700 mt-1">
          Les opérateurs disponibles dans votre pays sont affichés ci-dessous.
          {requiredOperators.length > 0 && (
            <span className="font-medium"> Les champs marqués d'un * sont obligatoires.</span>
          )}
        </p>
      </div>
      
      {/* Champs des opérateurs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {operatorsToShow.map((operator) => {
          const isRequired = isOperatorRequired(operator);
          return (
            <div key={operator.field}>
              <label htmlFor={operator.field} className="block text-sm font-medium mb-1">
                {getFieldLabel(operator)}
              </label>
              <input
                type="tel"
                id={operator.field}
                placeholder={getFieldPlaceholder(operator)}
                className={`w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base ${
                  isRequired 
                    ? 'focus:ring-amber-500 border-l-4 border-amber-400' 
                    : 'focus:ring-blue-500'
                }`}
                value={paymentNumbers[operator.field] || ''}
                onChange={(e) => onPaymentNumberChange(operator.field, e.target.value)}
                required={isRequired}
              />
              {isRequired && (
                <p className="text-xs text-amber-600 mt-1">
                  Ce numéro est obligatoire pour votre pays
                </p>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Option pour afficher tous les champs */}
      {!showAllFields && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => onPaymentNumberChange('_showAll', 'true')}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            + Afficher tous les opérateurs disponibles
          </button>
        </div>
      )}
      
      {/* Message d'aide */}
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-600">
          <strong>💡 Conseil :</strong> Renseignez plusieurs numéros pour permettre aux donateurs 
          d'utiliser leur opérateur préféré. Les numéros peuvent être au format local ou international.
        </p>
      </div>
    </div>
  );
}
