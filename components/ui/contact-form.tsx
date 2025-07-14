'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { toast } from 'react-hot-toast';

interface ContactFormProps {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
}

export const ContactForm = ({
  title = "Contactez-nous",
  description = "Nous sommes disponibles pour répondre à vos questions, recevoir vos commentaires ou discuter d'opportunités de collaboration. Dites-nous comment nous pouvons vous aider !",
  phone = "+221 77 123 45 67",
  email = "contact@africagnotte.com",
  address = "Dakar, Sénégal",
  whatsapp = "+221 77 123 45 67",
}: ContactFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulation d'envoi - remplacer par votre API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast.success('Message envoyé avec succès !');
      
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 3000);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--success-color)' }}>
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark-color)' }}>
              Message envoyé !
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="px-8 py-3"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Envoyer un autre message
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container-custom">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          {/* Informations de contact */}
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
            <div className="text-center lg:text-left">
              <h1 className="mb-4 text-4xl md:text-5xl font-bold" style={{ color: 'var(--dark-color)' }}>
                {title}
              </h1>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
            
            <div className="mx-auto w-fit lg:mx-0">
              <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left" style={{ color: 'var(--dark-color)' }}>
                Nos Coordonnées
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Téléphone</p>
                    <a href={`tel:${phone}`} className="text-gray-600 hover:text-orange-600 transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--secondary-color)' }}>
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href={`mailto:${email}`} className="text-gray-600 hover:text-green-600 transition-colors">
                      {email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-color)' }}>
                    <MapPin className="w-5 h-5" style={{ color: 'var(--dark-color)' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Adresse</p>
                    <p className="text-gray-600">{address}</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--light-color)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--dark-color)' }}>
                    💬 WhatsApp
                  </p>
                  <a 
                    href={`https://wa.me/${whatsapp.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 transition-colors font-medium"
                  >
                    {whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="mx-auto flex max-w-screen-md flex-col gap-6 rounded-xl border border-gray-200 p-8 shadow-lg bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="firstName" className="font-medium" style={{ color: 'var(--dark-color)' }}>
                    Prénom *
                  </Label>
                  <Input 
                    type="text" 
                    id="firstName" 
                    name="firstName"
                    placeholder="Votre prénom" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="lastName" className="font-medium" style={{ color: 'var(--dark-color)' }}>
                    Nom *
                  </Label>
                  <Input 
                    type="text" 
                    id="lastName" 
                    name="lastName"
                    placeholder="Votre nom" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="email" className="font-medium" style={{ color: 'var(--dark-color)' }}>
                  Email *
                </Label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email"
                  placeholder="votre.email@exemple.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="subject" className="font-medium" style={{ color: 'var(--dark-color)' }}>
                  Sujet *
                </Label>
                <Input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  placeholder="Objet de votre message" 
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <div className="grid w-full gap-2">
                <Label htmlFor="message" className="font-medium" style={{ color: 'var(--dark-color)' }}>
                  Message *
                </Label>
                <Textarea 
                  placeholder="Écrivez votre message ici..." 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
