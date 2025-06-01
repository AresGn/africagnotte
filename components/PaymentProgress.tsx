'use client';

import { FaCheck, FaUser, FaCreditCard, FaHeart } from 'react-icons/fa';

interface PaymentProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Montant', icon: FaHeart },
  { id: 2, name: 'Informations', icon: FaUser },
  { id: 3, name: 'Paiement', icon: FaCreditCard },
];

export default function PaymentProgress({ currentStep }: PaymentProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex items-center">
              {/* Étape */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-lime-500 text-white'
                      : isCurrent
                      ? 'bg-lime-100 text-lime-600 border-2 border-lime-500'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? <FaCheck /> : <Icon />}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isCompleted || isCurrent ? 'text-lime-600' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>

              {/* Ligne de connexion */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 transition-colors ${
                    currentStep > step.id ? 'bg-lime-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
