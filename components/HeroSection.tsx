"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const WHATSAPP_LINK =
  "https://wa.me/523221175350?text=Hi%20Bones%2C%20I'd%20like%20to%20book%20a%20day%20trip";

export default function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 })
          .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
          .fromTo(ctaRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
          .fromTo(imageRef.current, { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 1.2 }, "-=1");
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section className="min-h-screen bg-mist relative overflow-hidden flex flex-col">
      {/* Minimal nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <span className="font-serif font-bold text-xl text-ink tracking-tight">Bones PV</span>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm py-2.5 px-5"
        >
          Book Now
        </a>
      </nav>

      {/* Hero content */}
      <div className="flex-1 flex items-center max-w-7xl mx-auto px-8 w-full pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left — Copy */}
          <div className="max-w-xl">
            <p className="section-label mb-6">Puerto Vallarta, Mexico</p>

            <h1
              ref={headlineRef}
              className="opacity-0 font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-ink leading-tight mb-8"
            >
              Tired of the
              <br />
              crowded beach?
              <br />
              <span className="italic text-gold">I know where to go.</span>
            </h1>

            <div ref={subRef} className="opacity-0 mb-10 space-y-4">
              <p className="text-gray-600 text-lg leading-relaxed">
                While everyone else is fighting for a beach chair,
                my clients are at a hidden cove with nobody around,
                eating fresh fish and swimming in water you have to see
                to believe.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                I have been driving Puerto Vallarta for 15 years.
                I know places that are not on any app.
                Let me be your guide for the day.
              </p>
            </div>

            <div ref={ctaRef} className="opacity-0 flex flex-col sm:flex-row gap-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon />
                Book a Day with Bones
              </a>
              <a href="#day-trips" className="btn-outline">
                See the secret spots
              </a>
            </div>

            <p className="text-muted text-sm mt-6">
              Airport transfers &bull; Shopping &bull; Night out &bull; Custom day trips
            </p>
          </div>

          {/* Right — Photo */}
          <div ref={imageRef} className="opacity-0 relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
              <Image
                src="/bones.jpg"
                alt="Bones — Private Driver and Local Guide, Puerto Vallarta"
                fill
                className="object-cover rounded-3xl"
                priority
              />
              {/* Floating cards */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl px-5 py-3.5 shadow-xl border border-black/5">
                <p className="text-ink font-bold text-sm">15+ Years</p>
                <p className="text-muted text-xs mt-0.5">Local since birth</p>
              </div>
              <div className="absolute -top-5 -right-5 bg-navy rounded-2xl px-5 py-3.5 shadow-xl">
                <p className="text-white font-bold text-sm">4.9 / 5</p>
                <p className="text-blue-300 text-xs mt-0.5">500+ rides</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/50">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-current animate-pulse" />
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
