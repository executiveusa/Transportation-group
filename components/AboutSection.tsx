"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const points = [
  "Clean car, always",
  "Safe driving, always",
  "Fair prices, no surprises",
  "English and Spanish, fluent",
];

export default function AboutSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(
            textRef.current,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: textRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );

          gsap.fromTo(
            imageRef.current,
            { opacity: 0, x: 30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: imageRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );
        });
      });
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div ref={textRef} className="opacity-0">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Who I Am
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              I am Bones. Been in Puerto Vallarta my whole life. Started driving
              family and friends, then word spread. Now I drive tourists, families,
              business people — whoever needs reliable transportation.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Whether you need airport pickup, a tour of the city, or just a
              safe ride at night — I got you.
            </p>

            <ul className="space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <CheckIcon />
                  <span className="text-gray-700 font-medium">{point}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/523221175350"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8 bg-brand-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Say Hello on WhatsApp
            </a>
          </div>

          {/* Image */}
          <div ref={imageRef} className="opacity-0 flex justify-center">
            <div className="relative w-full max-w-md">
              <Image
                src="/bones.jpg"
                alt="Bones with his car in Puerto Vallarta"
                width={480}
                height={560}
                className="rounded-2xl object-cover w-full shadow-xl"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-red flex items-center justify-center">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}
