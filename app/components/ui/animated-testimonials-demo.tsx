"use client";

import { AnimatedTestimonials } from "./animated-testimonials";

function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "AfriCagnotte m'a permis de collecter des fonds pour mon projet associatif en un temps record. L'interface est intuitive et le service client très réactif.",
      name: "Sarah Diallo",
      designation: "Fondatrice d'une ONG au Sénégal",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "La plateforme est sécurisée et transparente. Nos donateurs ont pu suivre l'évolution de notre campagne en temps réel et nous avons pu financer notre école en Côte d'Ivoire.",
      name: "Michel Kouamé",
      designation: "Directeur de projet éducatif",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "En tant qu'entrepreneur africain, AfriCagnotte m'a offert une solution adaptée à mes besoins de financement. Le processus de retrait des fonds est simple et rapide.",
      name: "Aminata Touré",
      designation: "Entrepreneuse au Mali",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Notre campagne de solidarité a dépassé nos attentes grâce à AfriCagnotte. La possibilité de partager facilement sur les réseaux sociaux a amplifié notre portée.",
      name: "Jean-Paul Nkosi",
      designation: "Coordinateur humanitaire au Congo",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "AfriCagnotte comprend les défis spécifiques du continent africain. Leur équipe nous a guidés tout au long du processus et nous avons pu financer notre clinique mobile au Ghana.",
      name: "Fatima Mensah",
      designation: "Médecin et fondatrice de projet de santé",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  
  return (
    <div suppressHydrationWarning={true}>
      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </div>
  );
}

export { AnimatedTestimonialsDemo }; 