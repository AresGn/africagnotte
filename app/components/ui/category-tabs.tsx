"use client";

import React from "react";
import { AnimatedTabs } from "./animated-tabs";
import { FaAmbulance, FaFirstAid, FaGraduationCap, FaUsers, FaBriefcase, FaTint, FaSeedling, FaHome, FaWheelchair, FaFemale } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const CategoryTabs = () => {
  const tabs = [
    {
      id: "urgence",
      label: "Urgence",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
          <div className="relative w-full h-60">
            <Image
              src="/images/Urgence.jpg"
              alt="Urgence"
              className="rounded-lg object-cover shadow-lg"
              fill
              quality={90}
            />
            <div className="absolute top-4 left-4 bg-[var(--primary-color)] p-2 rounded-full">
              <FaAmbulance className="text-white text-xl" />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-bold mb-0 text-[var(--dark-color)]">
              Urgence
            </h2>
            <p className="text-sm text-[var(--dark-color)] mt-0">
              Soutenez des personnes confrontées à des situations d&apos;urgence comme des catastrophes naturelles, 
              des accidents ou des crises humanitaires nécessitant une aide immédiate.
            </p>
            <div className="text-right mt-auto">
              <Link 
                href="/category/urgence" 
                className="inline-block px-4 py-2 bg-[var(--primary-color)] text-white rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Explorer
              </Link>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sante",
      label: "Santé",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
          <div className="relative w-full h-60">
            <Image
              src="/images/Santé.jpg"
              alt="Santé"
              className="rounded-lg object-cover shadow-lg"
              fill
              quality={90}
            />
            <div className="absolute top-4 left-4 bg-[var(--secondary-color)] p-2 rounded-full">
              <FaFirstAid className="text-white text-xl" />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-bold mb-0 text-[var(--dark-color)]">
              Santé
            </h2>
            <p className="text-sm text-[var(--dark-color)] mt-0">
              Aidez à financer des soins médicaux, des traitements ou des équipements de santé 
              pour ceux qui n&apos;ont pas accès à des services de santé adéquats.
            </p>
            <div className="text-right mt-auto">
              <Link 
                href="/category/sante" 
                className="inline-block px-4 py-2 bg-[var(--secondary-color)] text-white rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Explorer
              </Link>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "education",
      label: "Éducation",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
          <div className="relative w-full h-60">
            <Image
              src="/images/Éducation.jpg"
              alt="Éducation"
              className="rounded-lg object-cover shadow-lg"
              fill
              quality={90}
            />
            <div className="absolute top-4 left-4 bg-[var(--accent-color)] p-2 rounded-full">
              <FaGraduationCap className="text-white text-xl" />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-bold mb-0 text-[var(--dark-color)]">
              Éducation
            </h2>
            <p className="text-sm text-[var(--dark-color)] mt-0">
              Contribuez à des projets éducatifs pour aider les enfants et les jeunes à accéder à une 
              éducation de qualité, à des fournitures scolaires ou à des bourses d&apos;études.
            </p>
            <div className="text-right mt-auto">
              <Link 
                href="/category/education" 
                className="inline-block px-4 py-2 bg-[var(--accent-color)] text-white rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Explorer
              </Link>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "familles",
      label: "Familles",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
          <div className="relative w-full h-60">
            <Image
              src="/images/Familles.jpg"
              alt="Familles"
              className="rounded-lg object-cover shadow-lg"
              fill
              quality={90}
            />
            <div className="absolute top-4 left-4 bg-[var(--primary-color)] p-2 rounded-full">
              <FaUsers className="text-white text-xl" />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-bold mb-0 text-[var(--dark-color)]">
              Familles
            </h2>
            <p className="text-sm text-[var(--dark-color)] mt-0">
              Soutenez des familles qui traversent des situations difficiles comme le relogement, 
              l&apos;accès aux besoins essentiels ou le soutien aux enfants et personnes âgées.
            </p>
            <div className="text-right mt-auto">
              <Link 
                href="/category/familles" 
                className="inline-block px-4 py-2 bg-[var(--primary-color)] text-white rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Explorer
              </Link>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "entrepreneuriat",
      label: "Entrepreneuriat Social",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
          <div className="relative w-full h-60">
            <Image
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&crop=center"
              alt="Entrepreneuriat Social"
              className="rounded-lg object-cover shadow-lg"
              fill
              quality={90}
            />
            <div className="absolute top-4 left-4 bg-[var(--accent-color)] p-2 rounded-full">
              <FaBriefcase className="text-white text-xl" />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-bold mb-0 text-[var(--dark-color)]">
              Entrepreneuriat Social
            </h2>
            <p className="text-sm text-[var(--dark-color)] mt-0">
              Soutenez des projets d&apos;entrepreneuriat social, des micro-entreprises et des
              coopératives qui créent de l&apos;emploi et réduisent les inégalités.
            </p>
            <div className="text-right mt-auto">
              <Link
                href="/category/entrepreneuriat-social"
                className="inline-block px-4 py-2 bg-[var(--accent-color)] text-white rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Explorer
              </Link>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "eau",
      label: "Accès à l'eau",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
          <div className="relative w-full h-60">
            <Image
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop&crop=center"
              alt="Accès à l'eau"
              className="rounded-lg object-cover shadow-lg"
              fill
              quality={90}
            />
            <div className="absolute top-4 left-4 bg-blue-500 p-2 rounded-full">
              <FaTint className="text-white text-xl" />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-bold mb-0 text-[var(--dark-color)]">
              Accès à l&apos;eau
            </h2>
            <p className="text-sm text-[var(--dark-color)] mt-0">
              Financez des projets d&apos;accès à l&apos;eau potable, de construction de puits
              et de systèmes d&apos;assainissement dans les communautés rurales.
            </p>
            <div className="text-right mt-auto">
              <Link
                href="/category/acces-eau"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Explorer
              </Link>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "environnement",
      label: "Environnement",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
          <div className="relative w-full h-60">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center"
              alt="Environnement"
              className="rounded-lg object-cover shadow-lg"
              fill
              quality={90}
            />
            <div className="absolute top-4 left-4 bg-green-500 p-2 rounded-full">
              <FaSeedling className="text-white text-xl" />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-bold mb-0 text-[var(--dark-color)]">
              Environnement
            </h2>
            <p className="text-sm text-[var(--dark-color)] mt-0">
              Participez à des projets écologiques, de reforestation, d&apos;énergies
              renouvelables et de protection de l&apos;environnement.
            </p>
            <div className="text-right mt-auto">
              <Link
                href="/category/environnement"
                className="inline-block px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Explorer
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AnimatedTabs 
      tabs={tabs} 
      className="w-full max-w-4xl mx-auto"
    />
  );
};

export { CategoryTabs }; 