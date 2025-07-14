'use client';

import { ContactForm } from '@/components/ui/contact-form';
import { Clock, Users, Shield, Heart } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--light-color)' }}>
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--dark-color)' }}>
              Parlons Ensemble
            </h1>
            <p className="text-xl leading-relaxed mb-8 text-gray-700">
              Votre voix compte pour nous. Que vous ayez une question, une suggestion 
              ou que vous souhaitiez collaborer avec nous, nous sommes là pour vous écouter.
            </p>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
          </div>
        </div>
      </section>

      {/* Pourquoi nous contacter */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--dark-color)' }}>
            Pourquoi nous contacter ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Support Cagnottes",
                description: "Aide pour créer ou gérer votre cagnotte"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Partenariats",
                description: "Collaborations et opportunités d'affaires"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Signalement",
                description: "Signaler un problème ou une fraude"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Support Technique",
                description: "Assistance technique et questions"
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--dark-color)' }}>
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section style={{ backgroundColor: 'var(--light-color)' }}>
        <ContactForm 
          title="Contactez-nous"
          description="Nous sommes disponibles pour répondre à vos questions, recevoir vos commentaires ou discuter d'opportunités de collaboration. Dites-nous comment nous pouvons vous aider !"
          phone="+221 77 123 45 67"
          email="contact@africagnotte.com"
          address="Dakar, Sénégal"
          whatsapp="+221 77 123 45 67"
        />
      </section>

      {/* FAQ rapide */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--dark-color)' }}>
            Questions Fréquentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "Combien de temps pour une réponse ?",
                answer: "Nous répondons généralement sous 24h en jours ouvrables."
              },
              {
                question: "Comment créer une cagnotte ?",
                answer: "Inscrivez-vous, cliquez sur 'Créer' et suivez les étapes guidées."
              },
              {
                question: "Les dons sont-ils sécurisés ?",
                answer: "Oui, nous utilisons des systèmes de paiement sécurisés et certifiés."
              },
              {
                question: "Puis-je modifier ma cagnotte ?",
                answer: "Oui, vous pouvez modifier certains éléments depuis votre tableau de bord."
              }
            ].map((faq, index) => (
              <div key={index} className="p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold mb-2" style={{ color: 'var(--dark-color)' }}>
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
