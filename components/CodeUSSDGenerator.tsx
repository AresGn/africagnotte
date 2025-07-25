'use client';

import { useState } from 'react';
import { FaCopy, FaCheckCircle, FaInfoCircle, FaMobileAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { genererCodeUSSD, type CodeUSSDGenere, type OperateurMobile } from '../lib/paiement-service';

interface CodeUSSDGeneratorProps {
  operateur: OperateurMobile;
  beneficiaire: string;
  montant: number;
  onCodeGenere?: (code: CodeUSSDGenere) => void;
}

export default function CodeUSSDGenerator({ 
  operateur, 
  beneficiaire, 
  montant, 
  onCodeGenere 
}: CodeUSSDGeneratorProps) {
  const [codeGenere, setCodeGenere] = useState<CodeUSSDGenere | null>(null);
  const [copied, setCopied] = useState(false);

  const genererCode = () => {
    try {
      const code = genererCodeUSSD(operateur.id, beneficiaire, montant);
      setCodeGenere(code);
      onCodeGenere?.(code);
      toast.success('Code USSD généré avec succès !');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la génération du code');
    }
  };

  const copierCode = async () => {
    if (!codeGenere) return;
    
    try {
      await navigator.clipboard.writeText(codeGenere.code);
      setCopied(true);
      toast.success('Code copié dans le presse-papiers !');
      
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error('Impossible de copier le code');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* En-tête */}
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{operateur.icone}</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{operateur.nom}</h3>
          <p className="text-sm text-gray-600">{operateur.description}</p>
        </div>
      </div>

      {/* Informations du transfert */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Bénéficiaire:</span>
            <p className="text-gray-900">{beneficiaire}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Montant:</span>
            <p className="text-gray-900 font-semibold">{montant.toLocaleString()} FCFA</p>
          </div>
        </div>
      </div>

      {/* Bouton de génération */}
      {!codeGenere ? (
        <button
          onClick={genererCode}
          className="w-full bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FaMobileAlt />
          Générer le code USSD
        </button>
      ) : (
        <div className="space-y-4">
          {/* Code généré */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                <FaMobileAlt />
                Code USSD généré
              </h4>
              <button
                onClick={copierCode}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {copied ? <FaCheckCircle /> : <FaCopy />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            
            <div className="bg-white border border-blue-300 rounded p-3 font-mono text-lg text-center text-blue-900 font-bold">
              {codeGenere.code}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <FaInfoCircle className="text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Instructions :</h4>
                <ol className="text-sm text-amber-700 space-y-1">
                  <li>1. Copiez le code ci-dessus</li>
                  <li>2. {codeGenere.instruction}</li>
                  <li>3. Composez le code sur votre téléphone</li>
                  <li>4. Confirmez le transfert</li>
                  <li>5. Prenez une capture d&apos;écran de la confirmation</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Exemple */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Exemple :</h4>
            <p className="text-sm text-gray-600">{codeGenere.exemple}</p>
          </div>

          {/* Bouton pour régénérer */}
          <button
            onClick={() => setCodeGenere(null)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Générer un nouveau code
          </button>
        </div>
      )}
    </div>
  );
}
