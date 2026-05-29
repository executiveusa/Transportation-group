"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const WHATSAPP_LINK =
  "https://wa.me/523221175350?text=Hi%20Bones%2C%20I%27d%20like%20to%20book%20a%20ride";

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.fromTo(
            textRef.current,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 1 }
          ).fromTo(
            imageRef.current,
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, duration: 1 },
            "-=0.6"
          );
        });
      });
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0f2744] via-[#1e3a5f] to-[#0a1f3d]"
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div ref={textRef} className="opacity-0">
            <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-4">
              Puerto Vallarta, Mexico
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Private Driver in Puerto Vallarta
            </h1>
            <p className="text-blue-200 text-xl font-light mb-4">
              Airport &bull; Shopping &bull; Events &bull; Night Out
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
              Been driving Puerto Vallarta 15+ years. I know every street,
              every restaurant, every shortcut. Book me for airport,
              shopping, business, night out. Safe. Reliable. Fair prices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-brand-red hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <PlaneIcon />
                Book Now
              </a>
            </div>

            <p className="text-gray-400 text-sm mt-5">
              Available 24/7 &nbsp;&bull;&nbsp; English &amp; Spanish
            </p>
          </div>

          {/* Right — Photo */}
          <div ref={imageRef} className="opacity-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm lg:max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-900/40 rounded-2xl" />
              <Image
                src="/bones.jpg"
                alt="Bones — Private Driver Puerto Vallarta"
                width={480}
                height={600}
                className="rounded-2xl object-cover w-full shadow-2xl"
                priority
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-xl">
                <p className="text-gray-900 font-bold text-sm">15+ Years</p>
                <p className="text-gray-500 text-xs">Driving PV</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-brand-red rounded-xl px-4 py-3 shadow-xl">
                <p className="text-white font-bold text-sm">4.9 Rating</p>
                <p className="text-red-200 text-xs">500+ Rides</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}

function PlaneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 1-5.5 2.5L10 10 1.8 8.2c-.3-.1-.5.1-.3.4l1.5 2.5c.2.3.5.5.8.5L8 12l-2 2-2-1c-.3-.2-.6.1-.4.4l1 2c.1.2.3.4.5.4l2 .5 3 3c.2.2.6.2.8-.1l.5-1.5 2.5-.5c.2 0 .4-.2.5-.5l.2-1c.1-.3-.1-.5-.4-.5l-.8.2L12 16l4.2-1.2c.3-.1.5-.3.5-.6l.1-.5z" />
    </svg>
  );
}
