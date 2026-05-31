"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const destinations = [
  {
    name: "Playa Colomitos",
    tagline: "A cove only reachable by boat",
    description:
      "Turquoise water, soft sand, maybe 20 people on a good day. No road to it — that is the whole point.",
    time: "20 min south of PV",
    slug: "playa-colomitos-secret-cove",
  },
  {
    name: "Las Animas",
    tagline: "No cars, no buses, no rush",
    description:
      "A village you can only reach by water taxi. Fresh fish, hammocks in the ocean, and the kind of quiet that reminds you why you left home.",
    time: "Water taxi from Boca",
    slug: "las-animas-full-day",
  },
  {
    name: "Yelapa",
    tagline: "Puerto Vallarta's best kept secret",
    description:
      "No cars, no ATMs, a waterfall 20 minutes on foot. The locals still outnumber the tourists. Go before that changes.",
    time: "1 hr south by boat",
    slug: "yelapa-why-i-love-it",
  },
];

export default function DayTripsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(
            ".trip-card",
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
              scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
            }
          );
        });
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section id="day-trips" ref={sectionRef} className="py-28 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="max-w-2xl mb-16">
          <p className="section-label text-blue-400 mb-4">Day Trips</p>
          <h2 className="display-heading text-white text-4xl md:text-5xl mb-6">
            Where I take people
            <br />
            <span className="italic text-gold">when they trust me.</span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            These are not on the tour bus circuit. You book me for the day —
            I drive, I know the water taxi guys, I pick the restaurant,
            I bring you back safe. You just show up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              className="trip-card opacity-0 group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-8 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-6">
                <PinIcon />
                <span className="text-blue-300 text-xs font-medium uppercase tracking-widest">
                  {dest.time}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                {dest.name}
              </h3>
              <p className="text-gold text-sm font-medium mb-4 italic">
                {dest.tagline}
              </p>
              <p className="text-blue-200 leading-relaxed mb-6">
                {dest.description}
              </p>

              <Link
                href={`/blog/${dest.slug}`}
                className="text-white/60 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors"
              >
                Read the full story
                <ArrowIcon />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://wa.me/523221175350?text=Hi%20Bones%2C%20I%27d%20like%20to%20plan%20a%20day%20trip"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            Plan a day trip with Bones
          </a>
          <p className="text-blue-400 text-sm mt-4">
            Full day from ~$360 USD &bull; Airport pickups from $35
          </p>
        </div>
      </div>
    </section>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
