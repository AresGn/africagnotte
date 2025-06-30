'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaThumbsUp, FaHandsHelping, FaLightbulb } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface ReactionCounts {
  likes: number;
  hearts: number;
  support: number;
  inspire: number;
  total: number;
}

interface TestimonialReactionsProps {
  testimonialId: string;
  className?: string;
}

type ReactionType = 'like' | 'heart' | 'support' | 'inspire';

export default function TestimonialReactions({ testimonialId, className = '' }: TestimonialReactionsProps) {
  const [reactions, setReactions] = useState<ReactionCounts>({
    likes: 0,
    hearts: 0,
    support: 0,
    inspire: 0,
    total: 0
  });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReactions();
  }, [testimonialId]);

  const fetchReactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/testimonials/${testimonialId}/reactions`);
      const data = await response.json();

      if (data.success) {
        setReactions(data.data.reactions);
        setUserReaction(data.data.userReaction);
      } else {
        console.error('Erreur lors du chargement des réactions:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType: ReactionType) => {
    if (submitting) return;

    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/testimonials/${testimonialId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reactionType })
      });

      const data = await response.json();

      if (data.success) {
        setReactions(data.data.reactions);
        setUserReaction(data.data.userReaction);
        
        // Afficher un message de succès discret
        if (data.message === 'Réaction supprimée') {
          toast.success('Réaction supprimée', { duration: 2000 });
        } else if (data.message === 'Réaction modifiée') {
          toast.success('Réaction modifiée', { duration: 2000 });
        } else {
          toast.success('Merci pour votre réaction !', { duration: 2000 });
        }
      } else {
        toast.error(data.error || 'Erreur lors de la réaction');
      }
    } catch (error) {
      console.error('Erreur lors de la réaction:', error);
      toast.error('Erreur lors de la réaction');
    } finally {
      setSubmitting(false);
    }
  };

  const reactionButtons = [
    {
      type: 'like' as ReactionType,
      icon: FaThumbsUp,
      label: 'J\'aime',
      color: 'text-blue-600',
      activeColor: 'text-blue-700 bg-blue-50',
      count: reactions.likes
    },
    {
      type: 'heart' as ReactionType,
      icon: FaHeart,
      label: 'Cœur',
      color: 'text-red-600',
      activeColor: 'text-red-700 bg-red-50',
      count: reactions.hearts
    },
    {
      type: 'support' as ReactionType,
      icon: FaHandsHelping,
      label: 'Soutien',
      color: 'text-green-600',
      activeColor: 'text-green-700 bg-green-50',
      count: reactions.support
    },
    {
      type: 'inspire' as ReactionType,
      icon: FaLightbulb,
      label: 'Inspirant',
      color: 'text-yellow-600',
      activeColor: 'text-yellow-700 bg-yellow-50',
      count: reactions.inspire
    }
  ];

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-pulse flex space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Boutons de réaction */}
      <div className="flex flex-wrap gap-2 mb-3">
        {reactionButtons.map(({ type, icon: Icon, label, color, activeColor, count }) => {
          const isActive = userReaction === type;
          
          return (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              disabled={submitting}
              className={`
                inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
                border border-gray-200 hover:border-gray-300
                ${isActive 
                  ? `${activeColor} border-current` 
                  : `text-gray-600 hover:${color} bg-white hover:bg-gray-50`
                }
                ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                transform hover:scale-105 active:scale-95
              `}
              title={`${label} (${count})`}
            >
              <Icon className={`mr-1.5 text-sm ${isActive ? '' : color}`} />
              <span className="mr-1">{label}</span>
              {count > 0 && (
                <span className={`
                  px-1.5 py-0.5 text-xs rounded-full font-semibold
                  ${isActive ? 'bg-white bg-opacity-70' : 'bg-gray-100'}
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Résumé des réactions */}
      {reactions.total > 0 && (
        <div className="text-sm text-gray-500">
          {reactions.total === 1 ? (
            '1 personne a réagi à ce témoignage'
          ) : (
            `${reactions.total} personnes ont réagi à ce témoignage`
          )}
        </div>
      )}

      {/* Message d'encouragement */}
      {reactions.total === 0 && (
        <div className="text-sm text-gray-400 italic">
          Soyez le premier à réagir à ce témoignage inspirant !
        </div>
      )}
    </div>
  );
}
