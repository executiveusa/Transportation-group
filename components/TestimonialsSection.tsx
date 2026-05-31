"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "I asked Bones to take me somewhere away from the tourist beaches. He brought me to a cove I cannot find on any map. One of the best days of my life.",
    author: "Sarah M.",
    role: "Visited January 2026",
  },
  {
    quote: "Used him for airport runs three trips in a row. He has never been late once. Simple as that.",
    author: "Marco L.",
    role: "Business traveler",
  },
  {
    quote: "He knows everyone. Needed a doctor at 10pm and he had his friend there in 45 minutes. That is not a service — that is a person who actually cares.",
    author: "Jennifer K.",
    role: "Expat, PV resident",
  },
  {
    quote: "Yelapa day trip was incredible. He knew exactly where to sit, what to order, when to leave before the afternoon boat crowd arrived. Effortless.",
    author: "David R.",
    role: "Visited March 2026",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(".review-card", { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          });
        });
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 bg-mist">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-16">
          <p className="section-label mb-4">Reviews</p>
          <h2 className="display-heading text-4xl md:text-5xl">
            What people say.
          </h2>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => <ReviewCard key={t.author} t={t} />)}
        </div>

        {/* Mobile scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto snap-x pb-4 -mx-8 px-8">
          {testimonials.map((t) => (
            <div key={t.author} className="snap-start flex-shrink-0 w-[300px]">
              <ReviewCard t={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="review-card opacity-0 card p-7 flex flex-col justify-between gap-6 h-full">
      <div>
        <Stars />
        <blockquote className="text-gray-700 leading-relaxed mt-4 italic">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
      </div>
      <div>
        <p className="font-semibold text-ink text-sm">{t.author}</p>
        <p className="text-muted text-xs mt-0.5">{t.role}</p>
      </div>
    </div>
  );
}

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#c9a96e">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}
