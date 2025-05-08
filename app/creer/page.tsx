'use client';

import { useState } from 'react';
import { FaCamera, FaBold, FaUnderline, FaImage, FaLink, FaVideo } from 'react-icons/fa';

// Utilisation des mêmes catégories que sur la page d'accueil
const categories = [
  { name: 'Santé', emoji: '🏥' },
  { name: 'Famille', emoji: '👪' },
  { name: 'Orphelins', emoji: '👶' },
  { name: 'Urgences', emoji: '🚨' }
];

export default function CreerCagnotte() {
  const [title, setTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [hideAmount, setHideAmount] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [description, setDescription] = useState('Quel que soit le montant, chacun peut participer à cette cagnotte. Pas besoin de créer un compte ou de s&apos;inscrire, c&apos;est rapide et les paiements par Carte Bancaire sont 100% sécurisés.\n\nSi vous ne pouvez pas participer financièrement, partagez cette cagnotte autour de vous au maximum. MERCI !');

  return (
    <main className="py-6 sm:py-10 bg-gray-50">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Créer une cagnotte</h1>
        
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="mb-6 sm:mb-8 p-6 sm:p-10 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="bg-gray-200 rounded-full p-3 sm:p-4 mb-2">
              <FaCamera className="text-gray-500 text-xl sm:text-3xl" />
            </div>
            <p className="text-base sm:text-lg font-medium text-gray-600">Sélectionnez l&apos;image principale</p>
          </div>
          
          <div className="mb-5 sm:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="title" className="block text-base sm:text-lg font-semibold">Titre de la cagnotte</label>
              <span className="text-gray-500 text-xs sm:text-sm">50 max</span>
            </div>
            <input 
              type="text" 
              id="title" 
              placeholder="Ex : Un nouveau véhicule pour Alex" 
              className="w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              maxLength={50}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="mb-5 sm:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="custom-url" className="block text-base sm:text-lg font-semibold">Personnalisez le lien</label>
              <span className="text-gray-500 text-xs sm:text-sm">30 max</span>
            </div>
            <div className="flex items-center w-full bg-gray-100 rounded-md">
              <span className="px-2 sm:px-3 text-gray-500 font-medium text-xs sm:text-sm">africagnotte.com/</span>
              <input 
                type="text" 
                id="custom-url" 
                placeholder="pour-alex" 
                className="flex-1 p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                maxLength={30}
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-5 sm:mb-6">
            <label htmlFor="category" className="block text-base sm:text-lg font-semibold mb-2">Choisissez une catégorie</label>
            <div className="relative">
              <select 
                id="category" 
                className="appearance-none w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10 text-sm sm:text-base"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mb-5 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Paramètres</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="private" 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-amber-500 focus:ring-amber-500"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)} 
                />
                <label htmlFor="private" className="text-gray-700 text-sm sm:text-base">Cagnotte privée</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="target" 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-amber-500 focus:ring-amber-500"
                  checked={showTarget}
                  onChange={() => setShowTarget(!showTarget)} 
                />
                <label htmlFor="target" className="text-gray-700 text-sm sm:text-base">Indiquer un montant à atteindre</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hide-amount" 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-amber-500 focus:ring-amber-500"
                  checked={hideAmount}
                  onChange={() => setHideAmount(!hideAmount)} 
                />
                <label htmlFor="hide-amount" className="text-gray-700 text-sm sm:text-base">Masquer le montant collecté</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="show-participants" 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-amber-500 focus:ring-amber-500" 
                  checked={showParticipants}
                  onChange={() => setShowParticipants(!showParticipants)}
                />
                <label htmlFor="show-participants" className="text-gray-700 text-sm sm:text-base">Afficher les participants (recommandé)</label>
              </div>
            </div>
          </div>
          
          <div className="mb-5 sm:mb-6">
            <label htmlFor="description" className="block text-base sm:text-lg font-semibold mb-2">Description</label>
            <div className="mb-2 flex space-x-2 border-b pb-2">
              <button className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded">
                <FaBold className="text-xs sm:text-sm" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded">
                <FaUnderline className="text-xs sm:text-sm" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded">
                <FaImage className="text-xs sm:text-sm" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded">
                <FaLink className="text-xs sm:text-sm" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded">
                <FaVideo className="text-xs sm:text-sm" />
              </button>
            </div>
            <textarea 
              id="description" 
              className="w-full p-2 sm:p-3 bg-gray-100 rounded-md min-h-[150px] sm:min-h-[200px] focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="text-center">
            <button 
              className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-md text-base sm:text-xl transition-colors"
            >
              Lancer ma cagnotte
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 