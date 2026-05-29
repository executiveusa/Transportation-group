"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote:
      "Best driver in PV. Knows the area perfectly, super safe, and fun to talk to. Will not use anyone else when I visit.",
    author: "Sarah M.",
    role: "Tourist",
  },
  {
    quote:
      "Reliable, professional, fair prices. I use Bones for all my airport runs. Never been late once in three years.",
    author: "Marco L.",
    role: "Business Owner",
  },
  {
    quote:
      "Real local guy. Not some corporate thing. You feel like you are getting a ride from a friend who actually knows the city.",
    author: "Jennifer K.",
    role: "Regular Client",
  },
];

function StarRating() {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#dc2626"
          stroke="none"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(
            ".testimonial-card",
            { opacity: 0, scale: 0.95, y: 20 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
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
    <section id="testimonials" ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What People Say
          </h2>
          <p className="text-gray-500 text-lg">
            Real reviews from real riders.
          </p>
        </div>

        {/* Desktop: 3 column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.author} testimonial={t} />
          ))}
        </div>

        {/* Mobile: horizontal scroll with snap */}
        <div className="md:hidden flex gap-6 overflow-x-auto snap-x pb-4 -mx-6 px-6">
          {testimonials.map((t) => (
            <div key={t.author} className="snap-start flex-shrink-0 w-80">
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  return (
    <div className="testimonial-card opacity-0 bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <StarRating />
      <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div>
        <p className="font-semibold text-gray-900">{testimonial.author}</p>
        <p className="text-gray-500 text-sm">{testimonial.role}</p>
      </div>
    </div>
  );
}
