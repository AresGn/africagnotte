"use client";

import React from "react";
import { AnimatedTabs } from "./animated-tabs";
import { FaAmbulance, FaFirstAid, FaGraduationCap, FaUsers } from "react-icons/fa";
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
  ];

  return (
    <AnimatedTabs 
      tabs={tabs} 
      className="w-full max-w-4xl mx-auto"
    />
  );
};

export { CategoryTabs }; 