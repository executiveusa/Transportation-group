"use client";

import { useEffect, useRef } from "react";

const stats = [
  { value: 15, suffix: "+", label: "Years", subtitle: "Driving PV" },
  { value: 500, suffix: "+", label: "Rides", subtitle: "Safe, on-time" },
  { value: 4.9, suffix: "", label: "Rating", subtitle: "From real travelers" },
  { value: 24, suffix: "/7", label: "Available", subtitle: "Always ready" },
];

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Stagger the stat cards in
          gsap.fromTo(
            ".stat-card",
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );

          // Count-up animation for each stat
          stats.forEach((stat, i) => {
            const el = countersRef.current[i];
            if (!el) return;

            const isDecimal = !Number.isInteger(stat.value);
            const obj = { val: 0 };

            gsap.to(obj, {
              val: stat.value,
              duration: 1.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                once: true,
              },
              onUpdate() {
                el.textContent = isDecimal
                  ? obj.val.toFixed(1)
                  : Math.round(obj.val).toString();
              },
              onComplete() {
                el.textContent = isDecimal
                  ? stat.value.toFixed(1)
                  : stat.value.toString();
              },
            });
          });
        });
      });
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section
      id="trust"
      ref={sectionRef}
      className="py-24 bg-[#0f2744] text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Why You Can Trust Me
          </h2>
          <p className="text-blue-300 text-lg">
            Numbers do not lie.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card opacity-0 text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
            >
              <div className="text-5xl font-bold text-white mb-2">
                <span
                  ref={(el) => {
                    countersRef.current[i] = el;
                  }}
                >
                  0
                </span>
                <span className="text-brand-red">{stat.suffix}</span>
              </div>
              <div className="text-xl font-semibold text-blue-200 mb-1">
                {stat.label}
              </div>
              <div className="text-blue-400 text-sm">{stat.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
