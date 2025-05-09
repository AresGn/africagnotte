'use client';

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["solidaire", "transparente", "africaine", "humanitaire", "simple"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full" style={{ backgroundColor: 'var(--light-color)' }}>
      <div className="container-custom">
        <div className="flex gap-6 py-16 md:py-24 lg:py-32 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-2 px-3 py-1 md:gap-4 md:px-4 md:py-2 text-xs md:text-sm" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--dark-color)' }}>
              Notre mission <MoveRight className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
          <div className="flex gap-3 md:gap-4 flex-col">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span style={{ color: 'var(--dark-color)' }}>Une plateforme</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center pb-1 md:pb-3 pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    style={{ color: 'var(--primary-color)' }}
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center px-4" style={{ color: 'var(--dark-color)' }}>
              AfricaGnotte est la première plateforme de collecte de dons 100% dédiée à l&apos;Afrique, 
              centrée sur l&apos;aide aux personnes en difficulté.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
            <Button size="lg" className="gap-2 text-sm md:text-base px-4 py-2 md:px-6 md:py-3 w-full sm:w-auto" variant="outline" style={{ borderColor: 'var(--primary-color)', color: 'var(--dark-color)' }}>
              Nous contacter <PhoneCall className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
            <Link href="/creer" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 text-sm md:text-base px-4 py-2 md:px-6 md:py-3 w-full" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                Créer une cagnotte <MoveRight className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero }; 