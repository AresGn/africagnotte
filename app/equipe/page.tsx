'use client';

import { Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

// Types pour les membres de l'équipe
interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  location: string;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
}

interface TeamSection {
  title: string;
  description: string;
  members: TeamMember[];
}

export default function EquipePage() {
  // Données d'exemple pour l'équipe
  const teamSections: TeamSection[] = [
    {
      title: "Développeurs",
      description: "L'équipe technique qui donne vie à la plateforme",
      members: [
        {
          id: "dev1",
          name: "Amadou Diallo",
          role: "Développeur Full-Stack Senior",
          description: "Expert en React et Node.js, passionné par les solutions technologiques pour l'Afrique",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          location: "Dakar, Sénégal",
          social: {
            linkedin: "https://linkedin.com/in/amadou-diallo",
            github: "https://github.com/amadou-diallo",
            email: "amadou@africagnotte.com"
          }
        },
        {
          id: "dev2",
          name: "Fatima Ouattara",
          role: "Développeuse Frontend",
          description: "Spécialiste UX/UI avec une expertise en accessibilité et design inclusif",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          location: "Abidjan, Côte d&apos;Ivoire",
          social: {
            linkedin: "https://linkedin.com/in/fatima-ouattara",
            twitter: "https://twitter.com/fatima_dev",
            email: "fatima@africagnotte.com"
          }
        }
      ]
    },
    {
      title: "Coordinateurs",
      description: "L&apos;équipe qui coordonne les opérations et les partenariats",
      members: [
        {
          id: "coord1",
          name: "Kwame Asante",
          role: "Coordinateur Général",
          description: "Coordination des opérations et développement des partenariats stratégiques",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          location: "Accra, Ghana",
          social: {
            linkedin: "https://linkedin.com/in/kwame-asante",
            email: "kwame@africagnotte.com"
          }
        },
        {
          id: "coord2",
          name: "Aisha Mwangi",
          role: "Coordinatrice Communauté",
          description: "Gestion de la communauté et relations avec les utilisateurs",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          location: "Nairobi, Kenya",
          social: {
            linkedin: "https://linkedin.com/in/aisha-mwangi",
            twitter: "https://twitter.com/aisha_community",
            email: "aisha@africagnotte.com"
          }
        }
      ]
    },
    {
      title: "Modérateurs",
      description: "L&apos;équipe qui veille à la qualité et l&apos;authenticité des cagnottes",
      members: [
        {
          id: "mod1",
          name: "Omar Benali",
          role: "Modérateur Principal",
          description: "Vérification et validation des cagnottes, garantie de l&apos;authenticité",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          location: "Casablanca, Maroc",
          social: {
            linkedin: "https://linkedin.com/in/omar-benali",
            email: "omar@africagnotte.com"
          }
        },
        {
          id: "mod2",
          name: "Grace Nkomo",
          role: "Modératrice Contenu",
          description: "Modération du contenu et support aux créateurs de cagnottes",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
          location: "Harare, Zimbabwe",
          social: {
            linkedin: "https://linkedin.com/in/grace-nkomo",
            email: "grace@africagnotte.com"
          }
        }
      ]
    },
    {
      title: "Administrateurs",
      description: "L&apos;équipe dirigeante qui définit la vision et la stratégie",
      members: [
        {
          id: "admin1",
          name: "Dr. Kofi Mensah",
          role: "Directeur Général",
          description: "Vision stratégique et développement de la plateforme AfricaGnotte",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
          location: "Lagos, Nigeria",
          social: {
            linkedin: "https://linkedin.com/in/kofi-mensah",
            twitter: "https://twitter.com/kofi_mensah",
            email: "kofi@africagnotte.com"
          }
        },
        {
          id: "admin2",
          name: "Mariam Traoré",
          role: "Directrice Opérations",
          description: "Gestion opérationnelle et développement des partenariats financiers",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
          location: "Bamako, Mali",
          social: {
            linkedin: "https://linkedin.com/in/mariam-traore",
            email: "mariam@africagnotte.com"
          }
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--light-color)' }}>
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--dark-color)' }}>
              Notre Équipe
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: 'var(--dark-color)' }}>
              Rencontrez les visages passionnés qui travaillent chaque jour pour faire 
              d&apos;AfricaGnotte la première plateforme de solidarité africaine
            </p>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
          </div>
        </div>
      </section>

      {/* Sections d'équipe */}
      {teamSections.map((section, sectionIndex) => (
        <section 
          key={section.title} 
          className={`py-16 ${sectionIndex % 2 === 0 ? 'bg-white' : ''}`}
          style={sectionIndex % 2 !== 0 ? { backgroundColor: 'var(--light-color)' } : {}}
        >
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark-color)' }}>
                {section.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {section.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.members.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--dark-color)' }}>
                        {member.name}
                      </h3>
                      <p className="font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                        {member.role}
                      </p>
                      <div className="flex items-center justify-center text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {member.location}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.description}
                      </p>
                    </div>

                    {/* Liens sociaux */}
                    <div className="flex justify-center space-x-3">
                      {member.social.email && (
                        <a 
                          href={`mailto:${member.social.email}`}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label={`Email ${member.name}`}
                        >
                          <Mail className="w-5 h-5 text-gray-600" />
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a 
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label={`LinkedIn de ${member.name}`}
                        >
                          <Linkedin className="w-5 h-5 text-blue-600" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a 
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label={`Twitter de ${member.name}`}
                        >
                          <Twitter className="w-5 h-5 text-blue-400" />
                        </a>
                      )}
                      {member.social.github && (
                        <a 
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label={`GitHub de ${member.name}`}
                        >
                          <Github className="w-5 h-5 text-gray-800" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Section Rejoindre l'équipe */}
      <section className="py-16 text-center" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-6">
            Rejoignez Notre Équipe
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Vous partagez notre vision d&apos;une Afrique plus solidaire ?
            Nous recherchons constamment des talents passionnés pour nous rejoindre.
          </p>
          <a 
            href="mailto:recrutement@africagnotte.com" 
            className="px-8 py-3 bg-white text-xl font-semibold rounded-md hover:bg-gray-100 transition-colors inline-block"
            style={{ color: 'var(--primary-color)' }}
          >
            Postuler maintenant
          </a>
        </div>
      </section>
    </main>
  );
}
