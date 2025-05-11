"use client";

import { AnimatedTestimonials } from "./animated-testimonials";

function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "AfriCagnotte m'a permis de collecter des fonds pour mon projet associatif en un temps record. L'interface est intuitive et le service client très réactif.",
      name: "Sarah Diallo",
      designation: "Fondatrice d'une ONG au Sénégal",
      src: "/images/testimonial-1.jpg",
    },
    {
      quote:
        "La plateforme est sécurisée et transparente. Nos donateurs ont pu suivre l'évolution de notre campagne en temps réel et nous avons pu financer notre école en Côte d'Ivoire.",
      name: "Michel Kouamé",
      designation: "Directeur de projet éducatif",
      src: "/images/testimonial-2.jpg",
    },
    {
      quote:
        "En tant qu'entrepreneur africain, AfriCagnotte m'a offert une solution adaptée à mes besoins de financement. Le processus de retrait des fonds est simple et rapide.",
      name: "Aminata Touré",
      designation: "Entrepreneuse au Mali",
      src: "/images/testimonial-3.jpg",
    },
    {
      quote:
        "Notre campagne de solidarité a dépassé nos attentes grâce à AfriCagnotte. La possibilité de partager facilement sur les réseaux sociaux a amplifié notre portée.",
      name: "Jean-Paul Nkosi",
      designation: "Coordinateur humanitaire au Congo",
      src: "/images/testimonial-4.jpg",
    },
    {
      quote:
        "AfriCagnotte comprend les défis spécifiques du continent africain. Leur équipe nous a guidés tout au long du processus et nous avons pu financer notre clinique mobile au Ghana.",
      name: "Fatima Mensah",
      designation: "Médecin et fondatrice de projet de santé",
      src: "/images/testimonial-5.jpg",
    },
  ];
  
  return (
    <div suppressHydrationWarning={true}>
      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </div>
  );
}

export { AnimatedTestimonialsDemo }; 