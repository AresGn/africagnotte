'use client';

import Link from 'next/link';
import { FaUserPlus, FaEdit, FaShare, FaHeart, FaShieldAlt, FaMobileAlt, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';

export default function CommentCaMarchePage() {
  const steps = [
    {
      icon: <FaUserPlus className="text-4xl text-white" />,
      title: "1. Inscrivez-vous",
      description: "Créez votre compte gratuitement en quelques clics. Aucun frais d'inscription.",
      details: [
        "Inscription rapide avec email",
        "Vérification de votre identité",
        "Accès immédiat à la plateforme"
      ]
    },
    {
      icon: <FaEdit className="text-4xl text-white" />,
      title: "2. Créez votre cagnotte",
      description: "Racontez votre histoire, ajoutez des photos et fixez votre objectif.",
      details: [
        "Titre et description détaillée",
        "Photos et vidéos explicatives",
        "Objectif financier (optionnel)",
        "Catégorie appropriée"
      ]
    },
    {
      icon: <FaShare className="text-4xl text-white" />,
      title: "3. Partagez largement",
      description: "Diffusez votre cagnotte sur les réseaux sociaux, WhatsApp et auprès de vos proches.",
      details: [
        "Outils de partage intégrés",
        "Lien personnalisé",
        "Réseaux sociaux et messaging",
        "Suivi des partages"
      ]
    },
    {
      icon: <FaHeart className="text-4xl text-white" />,
      title: "4. Recevez les dons",
      description: "Les donateurs participent en toute sécurité et vous recevez les fonds directement.",
      details: [
        "Paiements sécurisés",
        "Transfert direct sur votre compte",
        "Suivi en temps réel",
        "Remerciements automatiques"
      ]
    }
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-3xl text-green-600" />,
      title: "100% Sécurisé",
      description: "Toutes les transactions sont cryptées et sécurisées. Vos données sont protégées."
    },
    {
      icon: <FaMobileAlt className="text-3xl text-blue-600" />,
      title: "Mobile Money",
      description: "Paiements via Orange Money, MTN Money, Moov Money et autres solutions locales."
    },
    {
      icon: <FaCheckCircle className="text-3xl text-amber-600" />,
      title: "Vérification",
      description: "Toutes les cagnottes sont vérifiées par notre équipe pour garantir leur authenticité."
    }
  ];

  const faqs = [
    {
      question: "Combien coûte la création d'une cagnotte ?",
      answer: "La création d'une cagnotte est entièrement gratuite. Nous prélevons seulement une petite commission sur les dons reçus pour maintenir la plateforme."
    },
    {
      question: "Comment puis-je recevoir les fonds collectés ?",
      answer: "Les fonds sont transférés directement sur votre compte Mobile Money ou bancaire. Le transfert se fait généralement sous 24-48h après la demande."
    },
    {
      question: "Puis-je modifier ma cagnotte après l'avoir créée ?",
      answer: "Oui, vous pouvez modifier le titre, la description, ajouter des photos et des actualités à tout moment depuis votre espace personnel."
    },
    {
      question: "Comment les donateurs peuvent-ils me faire confiance ?",
      answer: "Toutes les cagnottes sont vérifiées par notre équipe. Nous affichons un badge de confiance et encourageons la transparence avec des mises à jour régulières."
    },
    {
      question: "Y a-t-il une limite de temps pour ma cagnotte ?",
      answer: "Non, il n'y a pas de limite de temps. Votre cagnotte reste active tant que vous le souhaitez. Vous pouvez la clôturer à tout moment."
    }
  ];

  return (
    <main className="pt-20 pb-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--dark-color)' }}>
            Comment ça marche ?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Créer une cagnotte sur AfricaGnotte est simple, rapide et sécurisé. 
            Suivez ces étapes pour mobiliser votre communauté autour de votre cause.
          </p>
        </div>

        {/* Étapes principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600 mb-4">{step.description}</p>
              <ul className="text-sm text-gray-500 space-y-1">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Fonctionnalités clés */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Pourquoi choisir AfricaGnotte ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start">
                  <FaQuestionCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers de personnes qui ont déjà transformé leur vie grâce à AfricaGnotte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/creer"
              className="px-8 py-4 bg-white text-amber-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Créer ma cagnotte
            </Link>
            <Link
              href="/cagnottes"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-amber-600 transition-colors"
            >
              Découvrir les cagnottes
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Vous avez d&apos;autres questions ?
            <Link href="/contact" className="text-amber-600 hover:text-amber-700 font-semibold ml-1">
              Contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
